import { CandlestickChart } from './charts/CandlestickChart';
import { RenkoChart } from './charts/RenkoChart';
import { HeikinAshiChart } from './charts/HeikinAshiChart';
import { BaselineChart } from './charts/BaselineChart';

// Create a global namespace for the library
window.ChartingLibrary = {
    CandlestickChart: CandlestickChart,
    RenkoChart: RenkoChart,
    HeikinAshiChart: HeikinAshiChart,
    BaselineChart: BaselineChart
};

export { CandlestickChart, RenkoChart, HeikinAshiChart, BaselineChart };