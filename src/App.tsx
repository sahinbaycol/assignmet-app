
import axios from 'axios'
import { CSSProperties, useEffect, useState } from 'react'
import './App.css'

interface Country {
      code:string,
      name:string,
      emoji:string
}


interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}


interface QueryResult {
  countries: Country[];
}

const query = `
  query {
    countries {
      code
      name
      emoji
    }
  }
  
`;


function App() {

  



  const styles={
    containerStyle:{
      display:"flex",
      flexDirection:"column",
      width:"100%",
      height:"100vh"
    } as CSSProperties,
    countriesTextStyle:{
      fontSize:"28px",
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      color:"white",
      backgroundColor:"#0997e3",
      padding:"15px",
      fontWeight:"600"
    } as CSSProperties,
    contentContainerStyle:{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"center",
      border:"1px solid black",
      margin:"10px",
      borderRadius:"8px",
      padding:"10px"
    } as CSSProperties,
    filterContainerStyle:{
      display:"flex",
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
      padding:"5px",
    } as CSSProperties,
    itemStyle:{
      padding:"10px",
      backgroundColor:"",
      
    } as CSSProperties,
    itemContainerStyle:{
      display:"flex",
      width:"100%",
      justifyContent:"center",
      border:"1px solid black"
    } as CSSProperties,
    filterBoxStyle:{
      display:"flex",
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"center",
      padding:"10px",
      backgroundColor:"#5364b5",
      borderRadius:"8px",
      border:"1px solid black"
    } as CSSProperties,
    selectedItemStyle:{
      backgroundColor:"black",
      color:"white",
    } as CSSProperties,
    unselectedItemStyle:{
      backgroundColor:"black",
      color:"white",
    }
  }



  
  const fetchData= async ()=> {
    try {
      
      const encodedQuery = encodeURIComponent(query);
      const url = `https://countries.trevorblades.com/graphql?query=${encodedQuery}`;
  
      
      const response = await axios.get<GraphQLResponse<QueryResult>>(url, {
        headers: { 'Accept': 'application/json' },
      });
      
     setSlicedResponse(response.data.data.countries.slice(0,20))
      if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        return;
      }
  
      
      console.log('Fetched users:', slicedResponse);
    } catch (error) {
      if (axios.isAxiosError(error)) {
      
        console.error('Axios error:', error.message);
      } else {
       
        console.error('An unexpected error occurred:', error);
      }
    }
  }

  useEffect(()=>{
    fetchData()
  },[])
  
  const [slicedResponse, setSlicedResponse]=useState<Country[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Country[]>(slicedResponse);
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const handleFilter = (e:any) => {
    const value = e.target.value;
    const filtered = slicedResponse.filter(user => user.name.includes(value));
    setFilteredUsers(filtered);
  };


  useEffect(()=>{
    const selectItem = () => {
      if (!Array.isArray(slicedResponse) || slicedResponse.length === 0) {
        return "";
      }
      return filteredUsers.length ? (filteredUsers.length >=10 ? setSelectedItemId(filteredUsers[9].code) : setSelectedItemId(filteredUsers[filteredUsers.length-1].code)) :  slicedResponse.length >= 10 ? setSelectedItemId(slicedResponse[9].code ) : setSelectedItemId( slicedResponse[slicedResponse.length - 1].code);
    };
    selectItem()
  },[slicedResponse,filteredUsers])

  const clickItem=(code:any)=>{
    if (code === selectedItemId) {
      setSelectedItemId("")
    } else {
      setSelectedItemId(code)
    }
  }

  

  const contentSlicedResponse=(filteredUsers.length? filteredUsers : slicedResponse).map((item)=>{
    return(
      <div onClick={()=>{
        clickItem(item.code)
      }}  style={{...styles.itemContainerStyle,backgroundColor:selectedItemId === item.code ? 'black' : 'white',color:selectedItemId === item.code ? 'white' : 'black'}}>
        <div style={styles.itemStyle} key={item.code} >
          {item.name}
        </div>
      </div>
    )
  })

  

return (
  <div style={styles.containerStyle}>
    <div style={styles.countriesTextStyle}>
      Countries
    </div>
    <div style={styles.filterContainerStyle}>
      <div style={styles.filterBoxStyle}>
        <div>Filter Country</div>
        <input placeholder='Type Here' id='filterInput' onChange={handleFilter}></input>
      </div>
    </div>
    <div style={styles.contentContainerStyle}>
      {contentSlicedResponse}
    </div>
  </div>
);
}

export default App
