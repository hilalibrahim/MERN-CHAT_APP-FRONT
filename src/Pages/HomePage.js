import React from 'react'
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    // Text,
    Image
  } from "@chakra-ui/react";
import logo from '../assets/logo.png'
import Login from '../components/Authetications/Login';
import SIgnup from '../components/Authetications/SIgnup';

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);


  return (
    <div>
        <Container maxW='xl' centerContent>
            <Box bg={'#85C1E9'} p={3} borderRadius={1000} m="40px 0 15px 0">
                <Image src={logo} w={150} borderRadius={1000}/>
            </Box>

            <Box bg='#D5F5E3' w="100%" p={4} borderRadius="lg" borderWidth="1px" >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SIgnup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
        </Container>
      
    </div>
  )
}

export default HomePage
