import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

/*
        3h5min
*/ 

// pre-defined, check the documentation 
const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            raduis: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips:{
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format('+0,0');
            },
        },
    },
    scales: {
        xAxes:[{
            type: 'time',
            time: {
                format: 'MM/DD/YY',
                tooltipFormat: 'll',
            },
        },],

        yAxes: [
            {
                gridLine:{
                    display: false,
                },
                ticks: {
                    callback: function(value, index,values){
                        return numeral(value).format('0a');
                    },
                },
            },
        ]
    }
}


function LineGraph() {

    const [data, setData] = useState({});
    
    const buildChartData = (data, casesType='cases') => {
        const chartData = [];
        let lastDataPoint;

        for(let date in data.cases) {
            if(lastDataPoint){
                const newDataPoint ={
                    x: date,
                    y:data[casesType][date]-lastDataPoint,
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        
        return chartData;
    }

    useEffect(()=>{
        const fetchData = async()=>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then( response => response.json())
            .then( data =>{
                // console.log(data);
                const chartData = buildChartData(data); // casesType is by default 'cases'
                setData(chartData);
            });
        }

        fetchData();
        
    }, []);

    

    return (
        <div>
            <h1>I am a graph</h1>
            {data?.length > 0 && (
                <Line 
                options= {options}
                data={{
                    datasets: [
                        {
                            backgroundColor: 'rgba(204,100,100)',
                            borderColor: '#CC1034',
                            data: data,
                        }
                    ]
                }}
            />
            )}
            
        </div>
    )
}

export default LineGraph
