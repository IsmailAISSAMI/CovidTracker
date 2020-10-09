import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table.js';
import LineGraph from './LineGraph.js';
import { sortData } from './util';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('WorldWide');
  const [countryInfo, setCountryInfo] = useState({}); 
  const [tableData, setTableData] = useState([]); 

   useEffect(() => {
      fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data=>{
        setCountryInfo(data);
      })
   },[])

  //I fetch all covid 19 data from https://corona.lmao.ninja/docs
  useEffect(()=>{
    
    // the code in here will run just once when the component loads to get all countries
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
          const countries = data.map((country)=>(
            {
              name : country.country, // output: france
              value: country.countryInfo.iso2 // output: fr
            }));
          
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

    const onCountryChange = async (event) => {
      const countryCode = event.target.value;
      //console.log('country code >>'+ countryCode);
      setCountry(countryCode);

      const url = countryCode==='WorldWide'
      ? 'https://disease.sh/v3/covid-19/all' 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`; 

      await fetch(url)
      .then(response => response.json())
      .then(data =>{
        setCountry(countryCode);

        // all of the data from the country response
        setCountryInfo(data);
      })
    }

  console.log('Country INFO >>', countryInfo);

  return (
    <div className="app">
      <div className='app-left'>
        {/* Header */}
        {/* Title + Select input dropdown field */}
        <div className='app-header'> 
          <h1>Covid 19 TRACKER</h1>

          <FormControl className='app-dropdown'>
            <Select
              variant='outlined'
              onChange={onCountryChange} 
              value={country}
            >
              <MenuItem value='WorldWide'>WorldWide</MenuItem>
              {/* Loop through all the contries 
              and show a dropdown of the options*/} 
              {
                countries.map( country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            

            </Select>

          </FormControl>
        </div> 
        
        
        {/* InfoBox title=' coronavirus cases ' */}
        {/* InfoBox title=' recovered ' */}
        {/* InfoBox title=' deaths ' */}
        <div className='app-stats'>
              <InfoBox title='Coronavirus cases' cases={countryInfo.todayCases} total={countryInfo.cases} />
              <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
              <InfoBox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        {/* Map */}
        <Map />

      </div>
      <Card className='app-right'>
        <CardContent>
          <h3>Live cases by COUNTRY</h3>
          {/* Table */}
          <Table countries={tableData}  />
          <h3>World Wide new Cases</h3>
          {/* Graph */} 
          <LineGraph />
        </CardContent>
        
      </Card>
    </div>
  );
}

export default App;
