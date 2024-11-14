import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {

  const [data, setData] = useState(null);  // To store the fetched data
  const [loading, setLoading] = useState(true);  // To track loading state
  const [error, setError] = useState(null);  // To track errors

  useEffect(() => {
    // Define the API endpoint
    const apiUrl = 'https://localhost:5261/api/Products';
          axios({      
            url: apiUrl,        
            method: 'GET',
            headers: {
              'accept': 'text/plain',
              'Authorization': 'Bearer ' + localStorage.getItem("site"),
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
  );
};

export default Products;
