if __name__ == '__main__':
    import argparse

    # Parsing arguments.
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input-folder', type=str, required=True,
                        help='Folder that contains the splitted stations CSV files.')
    parser.add_argument('-o', '--output-folder', type=str, required=True,
                        help='Folder that will contain the results of the processing.')
    args = parser.parse_args()

    import os
    import glob
    import logging
    logging.basicConfig(level=logging.INFO)

    import pandas as pd
    import numpy as np
    from tqdm import tqdm

    import lgb

    DF_FILES = args.input_folder

    # station ids to be considered (those with enough info, previously filtered out)
    station_ids = pd.read_csv('../notebooks/datasets/chicago_stations.csv')['id'].unique()

    # For each station name...
    name_it = glob.glob(os.path.join(DF_FILES, '*.csv'))
    for dfpath in tqdm(name_it):
        # Load the sub-dataset.
        df = pd.read_csv(dfpath, parse_dates=[2], header=0)
        station_id = df['id'].unique()[0]
        # Only process station if it has enough data
        if station_id in station_ids:
            try:
                logging.info(f'Processing {dfpath}')
                # Preprocessing.
                logging.info('Rounding timestamps.')
                df = lgb.round_ts(df)
                logging.info('Resampling.')
                df = lgb.resample_data(df)
                logging.info('Computing features.')
                df = lgb.compute_features(df)
                logging.info('Train/test splits.')
                train, test = lgb.train_test_split(df)
                logging.info('Fitting.')
                rmse, model, prediction = lgb.optimize(
                    train, test, lgb.features, lgb.target, iters=10)

                # appending the predictions
                test.loc[:, 'prediction'] = prediction

                # historical data, last 2 weeks from cut-off date (convert to original scale)
                train = train.loc[train.index[-14*24*6:], lgb.target]

                # predictions, first 2 weeks from cut-off date
                test = test.loc[:, lgb.target + ['prediction']]
                hist_file = os.path.join(args.output_folder,
                                        '{}_hist.csv'.format(int(station_id)))
                pred_file = os.path.join(args.output_folder,
                                        '{}_pred.csv'.format(int(station_id)))

                train.to_csv(hist_file)
                test.to_csv(pred_file)
            except:
                logging.error('There was some error processing station {}'.format(station_id))

    logging.info('Done.')
