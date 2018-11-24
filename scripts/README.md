# Training models

This guide describes how to run the program to train gradient boosting models for our current splitted-by-stations dataset.

## Dependencies

In order to set up the necessary environment to run this script, make sure you install the following dependencies.

```bash
pip install numpy pandas sklearn \
            scikit-optimize \
            lightgbm \
            tqdm
```

## Usage

First, the separated station csv files need to be placed in a same folder. For instance:

```bash
ls path/to/my/folder
000_Buckingham Fountain.csv    001_Shedd Aquarium.csv         002_Burnham Harbor.csv         003_State St & Harrison St.csv 004_Dusable Harbor.csv
```

To run the program:

```bash
python lgb_train.py -i path/to/my/folder
```
