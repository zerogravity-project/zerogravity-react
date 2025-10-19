import { EmotionsCharts } from './_components/EmotionsCharts';
import { ChartProvider } from './_contexts/ChartContext';

export default function ProfileChartPage() {
  return (
    <ChartProvider>
      <EmotionsCharts />
    </ChartProvider>
  );
}
