import { Box, Text } from "@chakra-ui/layout";
import { Avatar, Button, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon,ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import './misc.css'
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react'
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserLitem";
import MusicPlayer from "./MusicPlayer";
import M1 from '../../assets/M1.mp3';
import M2 from '../../assets/M2.mp3';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const musicList = [M1, M2];


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user,setSelectedChat,chats,setChats,notification,
    setNotification } = ChatState();
  const toast=useToast()
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const history=useHistory()
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  

  return (
    <>
    <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px">
    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>

            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        
          <Menu>
          <MusicPlayer musicList={musicList} />
           
            <Text fontSize="l" align='center'>
          MinduApp
         
        </Text>
        <MenuButton>
        <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
            <BellIcon fontSize='2xl'/>
              
      
            </MenuButton>
           
        
          </Menu>
          <Menu  id="avatar">
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}><Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} id='pic'></Avatar></MenuButton>
            
            <MenuList>
            <ProfileModal user={user}>
      <MenuItem>My Profile </MenuItem></ProfileModal>
      <MenuDivider />
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
    </MenuList>

          </Menu>
   

          
  
     
     

    </Box>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading/>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
    </>
  );
}

export default SideDrawer
