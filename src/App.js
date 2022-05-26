import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import CovidSummary from './Components/CovidSummary';
import LineGraph from './Components/LineGraph';

const App = () => {
  const [totalconfirmed, settotalconfirmed] = useState(0);
  const [totalRecovered, settotalRecovered] = useState(0);
  const [totalDeaths, settotalDeaths] = useState(0);
  const [loading, setloading] = useState(false)
  const [covidSummary, setcovidSummary] = useState({})
  const [days, setDays] = useState()
  const [country, setCountry] = useState('')
  const [coronaCountAr, setcoronaCountAr] = useState([]);
  const [label, setLabel] = useState([])




  useEffect(() => {
    setloading(true)
    axios.get(`https://api.covid19api.com/summary`)
      .then(res => {
        setloading(false)
        console.log(res);
        if (res.status === 200) {
          settotalconfirmed(res.data.Global.TotalConfirmed)
          settotalRecovered(res.data.Global.TotalRecovered)
          settotalDeaths(res.data.Global.TotalDeaths)
          setcovidSummary(res.data);
        }
      })
      .catch(error => {
        console.log(error)
      })

  }, []);




  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const _date = d.getDate();
    // console.log(`${year}-${month}-${_date}`)
    return `${year}-${month}-${_date}`
  }
  const countryHandler = (e) => {
    setCountry(e.target.value)
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - days));
    // console.log(from, to);
    getCoronaReportByDateRange(e.target.value, from, to)
  }

  const daysHandler = (e) => {
    setDays(e.target.value)
    const d = new Date();
    const to = formatDate(d);
    const from = formatDate(d.setDate(d.getDate() - e.target.value));
    getCoronaReportByDateRange(country, from, to)

  }

  const getCoronaReportByDateRange = (countrySlug, from, to) => {
    axios.get(`https://api.covid19api.com/country/${countrySlug}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`)
      .then(res => {
        // console.log(res)
        const yAxisCoronaCount = res.data.map(d => d.Cases);
        const xAxislabel = res.data.map(d => d.Date);
        const covidDetails = covidSummary.Countries.find(country => country.Slug === countrySlug)
        setcoronaCountAr(yAxisCoronaCount);
        setLabel(xAxislabel)
        settotalconfirmed(covidDetails.TotalConfirmed);
        settotalRecovered(covidDetails.TotalRecovered);
        settotalDeaths(covidDetails.TotalDeaths);

      })
      .catch(error => {
        console.log(error)
      })
  }

  if (loading) {
    return <p className='loading'>Fetching data from api..............</p>
  }
  return (
    <div className="App">
      <CovidSummary
        totalconfirmed={totalconfirmed}
        totalRecovered={totalRecovered}
        totalDeaths={totalDeaths}
        country={country}
      />
      <div className='select-box'>
        <select value={country} onChange={countryHandler}>
          <option value=''>Select Country</option>
          {
            covidSummary.Countries && covidSummary.Countries.map(country =>

              <option key={country.Slug} value={country.Slug}>{country.Country}</option>
            )
          }
        </select>

        <select value={days} onChange={daysHandler}>
          <option value=''>Select Days</option>
          <option value='7'>Last 7 Days</option>
          <option value='30'>Last 30 Days</option>
          <option value='90'>Last 90 Days</option>
        </select>



        
      </div>
      <LineGraph yAxis={coronaCountAr} xAxis={label}/>
    </div>
  );
}

export default App;
