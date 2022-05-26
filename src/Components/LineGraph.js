import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

const LineGraph = (props) => {
    const { yAxis , xAxis } = props
    return (
        <div style={{ width: '600px', height: '400px', margin: '50px auto' }}>
            <Line data={{
                labels: xAxis.map(l=>l.substr(0,10)),
                datasets: [
                    {
                        label: 'Cases',
                        fill: true,
                        data: yAxis,

                        backgroundColor: 'rgba(75,192,192,0.4)',
                    },
                    
                ],
            }} />
        </div>
    );

}
export default LineGraph;
