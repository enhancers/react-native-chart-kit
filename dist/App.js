// import 'babel-polyfill'; // TODO: Is it needed anymore?
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
// @ts-ignore: add ambient declaration of untyped module
import ScrollableTabView from 'react-native-scrollable-tab-view';
import {
  contributionData,
  data,
  pieChartData,
  progressChartData,
  stackedBarGraphData,
} from './data';
import {
  BarChart,
  ContributionGraph,
  LineChart,
  PieChart,
  ProgressChart,
  StackedBarChart,
} from './src';
const configList = [
  {
    backgroundColor: '#000000',
    style: {
      borderRadius: 16,
    },
    chartConfig: {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientTo: '#08130D',
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    },
  },
  {
    backgroundColor: '#022173',
    style: {
      borderRadius: 16,
    },
    chartConfig: {
      backgroundGradientFrom: '#022173',
      backgroundGradientTo: '#1b3fa0',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      propsForBackgroundLines: {
        strokeDasharray: '',
      },
    },
  },
  {
    backgroundColor: '#ffffff',
    chartConfig: {
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    },
  },
  {
    backgroundColor: '#26872a',
    style: {
      borderRadius: 16,
    },
    chartConfig: {
      backgroundGradientFrom: '#43a047',
      backgroundGradientTo: '#66bb6a',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    },
  },
  {
    backgroundColor: '#000000',
    chartConfig: {
      backgroundGradientFrom: '#000000',
      backgroundGradientTo: '#000000',
      color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
    },
  },
  {
    backgroundColor: '#0091EA',
    chartConfig: {
      backgroundGradientFrom: '#0091EA',
      backgroundGradientTo: '#0091EA',
      color: (opacity = 1) => `rgba(${255}, ${255}, ${255}, ${opacity})`,
    },
  },
  {
    backgroundColor: '#e26a00',
    style: {
      borderRadius: 16,
    },
    chartConfig: {
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    },
  },
  {
    backgroundColor: '#b90602',
    style: {
      borderRadius: 16,
    },
    chartConfig: {
      backgroundGradientFrom: '#e53935',
      backgroundGradientTo: '#ef5350',
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    },
  },
  {
    backgroundColor: '#ff3e03',
    chartConfig: {
      backgroundGradientFrom: '#ff3e03',
      backgroundGradientTo: '#ff3e03',
      color: (opacity = 1) => `rgba(${0}, ${0}, ${0}, ${opacity})`,
    },
  },
];
export class App extends React.PureComponent {
  renderTabBar() {
    return <StatusBar hidden />;
  }
  render() {
    const {width} = Dimensions.get('window');
    const height = 256;
    return (
      <ScrollableTabView renderTabBar={this.renderTabBar}>
        {configList.map((config, index) => {
          const {style, backgroundColor, chartConfig} = config;
          const labelStyle = [styles.label, {color: chartConfig.color()}];
          const graphStyle = [styles.graphSpacing, style];
          return (
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              key={index}
              style={{
                backgroundColor,
              }}>
              <Text style={labelStyle}>Bezier Line Chart</Text>
              <LineChart
                bezier
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                yAxisSuffix="k"
                chartConfig={chartConfig}
                style={graphStyle}
                verticalLabelRotation={20}
                onDataPointClick={({value, getColor}) =>
                  showMessage({
                    message: `${value}`,
                    description: 'You selected this value',
                    backgroundColor: getColor(0.9),
                  })
                }
                formatXLabel={label => label.toUpperCase()}
              />
              <FlashMessage duration={1000} />

              <Text style={labelStyle}>Progress Chart</Text>
              <ProgressChart
                data={progressChartData}
                width={width}
                height={height}
                chartConfig={chartConfig}
                style={graphStyle}
                hideLegend={false}
              />

              <Text style={labelStyle}>Bar Graph</Text>
              <BarChart
                width={width}
                height={height}
                data={data}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={graphStyle}
              />

              <Text style={labelStyle}>Bar Graph (Rounded)</Text>
              <BarChart
                width={width}
                height={height}
                data={data}
                yAxisLabel="$"
                chartConfig={{...chartConfig, barRadius: 16}}
                style={graphStyle}
                barFull
              />

              <Text style={labelStyle}>Stacked Bar Graph</Text>
              <StackedBarChart
                style={graphStyle}
                data={stackedBarGraphData}
                width={width}
                height={220}
                chartConfig={chartConfig}
              />

              <Text style={labelStyle}>Pie Chart</Text>
              <PieChart
                data={pieChartData}
                height={height}
                width={width}
                chartConfig={chartConfig}
                accessor="population"
                style={[graphStyle, styles.pieChartSpacing]}
              />

              <Text style={labelStyle}>Line Chart</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={graphStyle}
              />

              <Text style={labelStyle}>Contribution Graph</Text>
              <ContributionGraph
                values={contributionData}
                width={width}
                height={height}
                endDate={new Date('2016-05-01')}
                numDays={105}
                chartConfig={chartConfig}
                style={graphStyle}
              />

              <Text style={labelStyle}>Line Chart</Text>
              <LineChart
                data={data}
                width={width}
                height={height}
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={StyleSheet.flatten([
                  graphStyle,
                  styles.graphLastSpacing,
                ])}
                hidePointsAtIndex={[0, data.datasets[0].data.length - 1]}
              />
            </ScrollView>
          );
        })}
      </ScrollableTabView>
    );
  }
}
const styles = StyleSheet.create({
  label: {
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  graphSpacing: {
    marginVertical: 8,
  },
  graphLastSpacing: {
    marginTop: 8,
    marginBottom: 0,
  },
  pieChartSpacing: {
    // paddingLeft: 15, // TODO: restore padding inside <Rect> spacing pie chart
  },
});
export default App;
//# sourceMappingURL=App.js.map
