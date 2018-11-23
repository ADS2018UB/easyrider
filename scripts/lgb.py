import datetime

import numpy as np
import pandas as pd

import lightgbm as lgb
from sklearn.preprocessing import LabelEncoder
from skopt import BayesSearchCV
from sklearn.model_selection import StratifiedKFold

xs_features = ['total_docks', 'docks_in_service', 'status', 'ab_daily_mean', 'ab_monthly_mean', 'ab_weekly_mean',
               'ab_daily_median', 'ab_monthly_median', 'ab_weekly_median', 'hour_x', 'hour_y',
               'month', 'quarter', 'day', 'hour', 'quarter_hour', 'dow', 'week', 'last_1w_hourly_mean',
               'last_1w_daily_mean', 'last_2w_hourly_mean', 'last_2w_daily_mean']
features = xs_features
target = ['available_bikes']


def filter_by_sation_id(df, station_id):
    # filter data by station_id
    df = df[df.id == station_id]
    df['ts'] = pd.to_datetime(df.ts, infer_datetime_format=True)
    return df


def round_ts(df):
    # round ts every 5 minutes (seconds are not aligned)
    df.loc[:, 'ts'] = df.ts.dt.round('5min')
    df.sort_values(by='ts', inplace=True)
    return df


def resample_data(df):
    return df.set_index('ts').resample('10Min', how='last', base=5).bfill()


def compute_features(df):
    # every hour we have 6 rows, one every 10 minutes
    entries_per_hour = 6
    last_1w_hourly_mean = df.shift(entries_per_hour*24*7 - entries_per_hour)[
        'available_bikes'].rolling(entries_per_hour).mean()
    last_1w_daily_mean = df.shift(entries_per_hour*24*7 - entries_per_hour*24)[
        'available_bikes'].rolling(entries_per_hour*24).mean()
    last_2w_hourly_mean = df.shift(entries_per_hour*24*7*2 - entries_per_hour)[
        'available_bikes'].rolling(entries_per_hour).mean()
    last_2w_daily_mean = df.shift(entries_per_hour*24*7*2 - entries_per_hour*24)[
        'available_bikes'].rolling(entries_per_hour*24).mean()
    # month of year
    df['month'] = df.index.month
    # quarter of year
    df['quarter'] = df.index.quarter
    # day of month
    df['day'] = df.index.day
    # hour of day
    df['hour'] = df.index.hour
    # cyclic features for hour
    df['hour_x'] = np.sin(2*np.pi*df['hour']/24)
    df['hour_y'] = np.cos(2*np.pi*df['hour']/24)
    # quarter of hour
    df['quarter_hour'] = np.floor(df.index.minute / 15)
    # day of week
    df['dow'] = df.index.dayofweek
    # week of year
    df['week'] = df.index.weekofyear

    ab_daily_mean = df.groupby('day')['available_bikes'].mean()
    ab_monthly_mean = df.groupby('month')['available_bikes'].mean()
    ab_weekly_mean = df.groupby('week')['available_bikes'].mean()

    ab_daily_median = df.groupby('day')['available_bikes'].median()
    ab_monthly_median = df.groupby('month')['available_bikes'].median()
    ab_weekly_median = df.groupby('week')['available_bikes'].median()

    for i, x in zip(ab_daily_mean.index, ab_daily_mean):
        df.loc[df.day == i, 'ab_daily_mean'] = x

    for i, x in zip(ab_monthly_mean.index, ab_monthly_mean):
        df.loc[df.month == i, 'ab_monthly_mean'] = x

    for i, x in zip(ab_weekly_mean.index, ab_weekly_mean):
        df.loc[df.week == i, 'ab_weekly_mean'] = x

    for i, x in zip(ab_daily_median.index, ab_daily_median):
        df.loc[df.day == i, 'ab_daily_median'] = x

    for i, x in zip(ab_monthly_median.index, ab_monthly_median):
        df.loc[df.month == i, 'ab_monthly_median'] = x

    for i, x in zip(ab_weekly_median.index, ab_weekly_median):
        df.loc[df.week == i, 'ab_weekly_median'] = x

    df['last_1w_hourly_mean'] = last_1w_hourly_mean
    df['last_1w_daily_mean'] = last_1w_daily_mean
    df['last_2w_hourly_mean'] = last_2w_hourly_mean
    df['last_2w_daily_mean'] = last_2w_daily_mean

    # set status to unknown when status is not available
    df.loc[pd.isna(df.status), 'status'] = 'Unknown'

    return df


def train_test_split(df, test_start='20181012'):
    # every hour we have 6 rows, one every 10 minutes
    entries_per_hour = 6
    train_df = df.query('20170101 <= ts < {}'.format(test_start))
    test_df = df.query('ts >= {}'.format(test_start))

    # overwrite last_1w_hourly_mean, last_1w_daily_mean columns for the second test week
    # this info is not available at test time!
    idx = test_df.shift(freq=datetime.timedelta(weeks=1))[
        :entries_per_hour*24*7].index
    features = ['last_1w_hourly_mean', 'last_1w_daily_mean']
    test_df.loc[idx, features] = test_df.loc[idx -
                                             datetime.timedelta(weeks=1), features]

    # drop first 2 weeks in train, no info for last_1w/2w features
    train_df = train_df.iloc[entries_per_hour*24*7*2:]

    print(train_df.shape, test_df.shape)
    print(train_df.index.min(), train_df.index.max(),
          test_df.index.min(), test_df.index.max())

    return train_df, test_df


def optimize(train_df, test_df, features, target, iters=50):
    # transform categorical features
    le = LabelEncoder()
    train_df['status'] = le.fit_transform(train_df['status'])
    test_df['status'] = le.transform(test_df['status'])

    bayes_cv_tuner = BayesSearchCV(
        estimator=lgb.LGBMRegressor(
            random_state=42
        ),
        search_spaces={
            'learning_rate': (0.01, 1.0, 'log-uniform'),
            'max_depth': (0, 50),
            'max_delta_step': (0, 20),
            'subsample': (0.01, 1.0, 'uniform'),
            'colsample_bytree': (0.01, 1.0, 'uniform'),
            'bagging_fraction': (0.01, 1.0, 'uniform'),
            'feature_fraction': (0.01, 1.0, 'uniform'),
            'reg_lambda': (1e-9, 1000, 'log-uniform'),
            'reg_alpha': (1e-9, 1.0, 'log-uniform'),
            'min_child_weight': (0, 5),
            'n_estimators': (100, 1000)
        },
        cv=StratifiedKFold(
            n_splits=2,
            shuffle=True,
            random_state=42
        ),
        scoring='neg_mean_squared_error',
        n_jobs=4,
        n_iter=iters,
        verbose=0,
        refit=True,
        random_state=42
    )

    # fit the model
    result = bayes_cv_tuner.fit(train_df[xs_features], train_df[target])

    # get predictions
    y_true = test_df[target].values
    y_hat = result.predict(test_df[xs_features].values)

    # return score
    return np.sqrt(np.mean((y_true - y_hat)**2)), result, y_hat
