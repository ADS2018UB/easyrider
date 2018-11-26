import pandas as pd
from tqdm import tqdm

CSV_PATH = '/home/alberto/dsm/ADS/projects/chicago_docks.csv'
BASE_PATH = '/home/alberto/Desktop/split_data'

COLUMNS = ['id', 'ts', 'station_name', 'address', 'total_docks', 'docks_in_service',
           'available_docks', 'available_bikes', 'percent_full', 'status', 'lat', 'lon',
           'position', 'record']


def save_splitted_station_data(index, station):
    dff = df.query(f'station_name == "{station}"')
    sname = station.replace('/', '_')
    dff.to_csv(f'{BASE_PATH}/{index:03d}_{sname}.csv')


df = pd.read_csv(CSV_PATH, names=COLUMNS, parse_dates=[1])
stations = df.station_name.unique()
stations = pd.Series(stations, name='station_name')

# Save station names.
stations.to_csv('station_names.csv')

# Save station independent CSVs.
for index, station in tqdm(enumerate(stations)):
    save_splitted_station_data(index, station)
