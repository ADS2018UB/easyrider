class StationsController < ApplicationController
  # before_action :set_station, only: [:show, :update, :destroy]
  before_action :set_station, only: [:show]

  # GET /stations
  def index
    @stations = Station.all
    # todo: get current state for each station for given date parameter
    @stations.each do |station|
      station['current_bikes'] = rand * station['capacity']
    end
    render json: @stations.as_json(except: [:created_at, :updated_at])
  end

  # GET /stations/1
  def show
    @station['current_bikes'] = rand * @station['capacity']
    render json: @station.as_json(except: [:created_at, :updated_at])
  end

  # # POST /stations
  # def create
  #   @station = Station.new(station_params)
  #
  #   if @station.save
  #     render json: @station, status: :created, location: @station
  #   else
  #     render json: @station.errors, status: :unprocessable_entity
  #   end
  # end
  #
  # # PATCH/PUT /stations/1
  # def update
  #   if @station.update(station_params)
  #     render json: @station
  #   else
  #     render json: @station.errors, status: :unprocessable_entity
  #   end
  # end
  #
  # # DELETE /stations/1
  # def destroy
  #   @station.destroy
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_station
      @station = Station.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def station_params
      params.require(:station).permit(:name, :lat, :lng, :capacity)
    end
end
