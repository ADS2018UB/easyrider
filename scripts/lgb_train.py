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
    from tqdm import tqdm

    import lgb

    DF_FILES = ''

    DF_FILES = args.input_folder

    # For each station name...
    name_it = glob.glob(os.path.join(DF_FILES, '*.csv'))
    for dfpath in tqdm(name_it):
        logging.info(f'Processing {dfpath}')
        # Load the sub-dataset.
        df = pd.read_csv(dfpath, parse_dates=[2], header=0)

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

        # Appending the predictions.
        test.loc[:, 'prediction'] = prediction

        # Store the model and the results.
        out_file = os.path.basename(dfpath)
        out_path = os.path.join(args.output_folder, out_file)
        test.to_csv(out_path)

    logging.info('Done.')
