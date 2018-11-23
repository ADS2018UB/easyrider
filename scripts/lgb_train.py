if __name__ == '__main__':
    import argparse

    # Parsing arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input-folder', type=str, required=True,
                        help='Folder that contains the splitted stations CSV files.')
    args = parser.parse_args()

    import os
    import glob
    import logging
    logging.basicConfig(level=logging.DEBUG)

    import pandas as pd
    from tqdm import tqdm

    import lgb

    DF_FILES = ''
    # COLUMNS = ['id', 'ts', 'station_name', 'address', 'total_docks', 'docks_in_service',
    #            'available_docks', 'available_bikes', 'percent_full', 'status', 'lat', 'lon',
    #            'position', 'record']

    def data_file(index, station):
        station = station.replace('/', '_')
        return DF_FILES.format(index, station)

    DF_FILES = args.input_folder
    logging.debug(DF_FILES)

    # For each station name...
    name_it = glob.glob(os.path.join(DF_FILES, '*.csv'))
    logging.debug(name_it)
    for dfpath in tqdm(name_it):
        logging.debug(f'Processing {dfpath}')
        # Load the sub-dataset
        df = pd.read_csv(dfpath, parse_dates=[2], header=0)

        # Preprocessing
        logging.debug('Rounding timestamps.')
        df = lgb.round_ts(df)
        logging.debug('Resampling.')
        df = lgb.resample_data(df)
        logging.debug('Computing features.')
        df = lgb.compute_features(df)
        logging.debug('Train/test splits.')
        train, test = lgb.train_test_split(df)
        logging.debug('Fitting.')
        rmse, model, prediction = lgb.optimize(
            train, test, lgb.features, lgb.target, iters=10)

        # Store the model and the results
        out_id = os.path.splitext(os.path.basename(dfpath))[0]
        logging.debug(out_id)
