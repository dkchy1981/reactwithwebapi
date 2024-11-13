import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {

  const [data, setData] = useState(null);  // To store the fetched data
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // To track errors

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = 'https://localhost:5261/api/Products';
    const loginUrl = 'https://localhost:5261/api/Login/login';
    const dataForLogin = {
     "userName": "string",
  "password": "string"
    };
    
     // Make the API call using Axios
     axios({      
      url: loginUrl,        
      method: 'POST',
      data : JSON.stringify(dataForLogin),
      headers: {
        'Content-Type': 'application/json; charset=utf-8', // Explicitly set the content type to JSON
        'accept': '*/*',
        'Access-Control-Allow-Origin':'*'
        }
      }
    )
    .then(response => {
      console.log('Token ' , response.data.accessToken)
      setLoading(false);  // Set loading to false once data is fetched
            // Make the API call using Axios
          axios({      
            url: apiUrl,        
            method: 'GET',
            headers: {
              'accept': 'text/plain',
              'Authorization': 'Bearer ' + response.data.accessToken,
              'Access-Control-Allow-Origin':'*'
            }
          }
        )
        .then(response => {
          setData(response.data);  // Set state with the response data
          setLoading(false);  // Set loading to false once data is fetched
        })
        .catch(error => {
          setError(error.message);  // Set error state in case of failure
          setLoading(false);  // Set loading to false in case of error
        });
      
    })
    .catch(error => {
      setError(error.message);  // Set error state in case of failure
      setLoading(false);  // Set loading to false in case of error
    });
  }, []);  // Empty dependency array means this runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const DisplayData=data?.map(
    (info)=>{
        return(
            <tr>
                <td>{info.id}</td>
                <td>{info.name}</td>
            </tr>
        )
    }
)

  return (
    <div style={{color: "red", width:"100%"}}>
     

<table className="table table-striped table-bordered">
<thead>
                    <tr>
                    <th>Sr.NO</th>
                    <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {DisplayData}
                </tbody>
    </table>
           
        </div>
    // <div>
    //   <h2>Fetched Data:</h2>
    //   <pre>{JSON.stringify(data, null, 2)}</pre>
    // </div>
  );
};

export default Products;
