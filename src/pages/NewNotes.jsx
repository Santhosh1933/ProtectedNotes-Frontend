import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import { GoKebabHorizontal } from "react-icons/go";
import { useRecoilState } from "recoil";
import { noteState } from "../hooks/NotesHook";
import { authHook } from "../hooks/AuthHook";
import { backendUrl } from "../../constant";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";

const EditNotes = () => {
  const [data, SetData] = useRecoilState(noteState);
  const [activeTab, setActiveTab] = useState(data[0].id);
  function SaveNotes() {}

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block", "link"],
    [{ header: 1 }],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    setActiveTab(data[0].id);
  }, [data.length]);

  return (
    <div>
      <Navbar SaveNotes={SaveNotes} />
      <div className="container py-8">
        <div>
          <h1 className="text-2xl text-primaryText font-semibold py-4 title tracking-wider">
            Create a new Note
          </h1>
          <Tabs variant="enclosed">
            <TabList className="flex items-stretch gap-4 overflow-scroll rm-scroll">
              {data.map((tab) => (
                <Tab key={tab.id} className="flex  items-center gap-2">
                  <p>{tab.tabName}</p>
                  <p>
                    <MdEdit />
                  </p>
                </Tab>
              ))}
              <div
                onClick={() => {
                  let tempArr = [...data];
                  tempArr.push({
                    id: uuidv4(),
                    tabName: "Empty Tab",
                    content: "",
                  });
                  SetData([...tempArr]);
                }}
                className="bg-slate-100 flex justify-center items-center px-4 rounded-t-md cursor-pointer"
              >
                <BiPlus />
              </div>
            </TabList>
            <TabPanels>
              {data.map((tab) => (
                <TabPanel key={tab.id}>
                  <ReactQuill
                    modules={modules}
                    theme="snow"
                    value={tab.content}
                    onChange={(content) => {
                      const newData = [...data];
                      const tabIndex = newData.findIndex(
                        (item) => item.id === tab.id
                      );
                      newData[tabIndex] = { ...newData[tabIndex], content };
                      SetData(newData);
                    }}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export const NewNotes = () => {
  const [auth, setAuth] = useRecoilState(authHook);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function checkRoute() {
    try {
      const res = await fetch(
        `${backendUrl}/route?route=${location.pathname.split("/")[2]}`
      );
      const data = await res.json();
      if (res.status !== 200) {
        navigate(`/${location.pathname.split("/")[2]}`);
        return;
      }
    } catch (error) {}
  }

  useEffect(() => {
    checkRoute();
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (!auth) {
      onOpen();
    }
  }, [auth]);

  async function handleOpenEditAccess() {
    try {
      setLoading(true);
      const res = await fetch(
        `${backendUrl}/edit-notes?route=${
          location.pathname.split("/")[2]
        }&editPassword=${password}`
      );
      const data = await res.json();
      if (res.status !== 200) {
        alert(data.error);
        return;
      }
      setAuth(true);
      onClose();
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <OverlayOne />
        <ModalContent>
          <ModalHeader>Welcome to Protected Notes 🔑</ModalHeader>
          <ModalBody>
            <p className="text-primaryText pb-4">
              Enter the Password for Edit Access
            </p>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="********"
            />
          </ModalBody>
          <ModalFooter>
            {loading ? (
              <Button colorScheme="info">Loading...</Button>
            ) : password.length != "" ? (
              <Button onClick={handleOpenEditAccess} colorScheme="green">
                Open
              </Button>
            ) : (
              <Button colorScheme="green">Open</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      {auth && <EditNotes />}
    </>
  );
};

// OverlayOne component remains unchanged
const OverlayOne = () => (
  <ModalOverlay
    bg="blackAlpha.300"
    backdropFilter="blur(10px) hue-rotate(90deg)"
  />
);
