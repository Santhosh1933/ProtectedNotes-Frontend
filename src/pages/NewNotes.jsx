import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import { Spinner } from "@chakra-ui/react";

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
  useToast,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import { GoKebabHorizontal } from "react-icons/go";
import { useRecoilState } from "recoil";
import { noteState } from "../hooks/NotesHook";
import { authHook } from "../hooks/AuthHook";
import { backendUrl } from "../../constant";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";

const EditNotes = ({ data, setData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeEdit, setActiveEdit] = useState(null);
  const [editText, setEditText] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [auth, setAuth] = useRecoilState(authHook);
  const navigate = useNavigate();
  const toast = useToast();
  // console.clear();

  async function ChangePassword() {
    console.log("Change Password");
  }
  async function DeleteRoute() {
    let prompt = confirm("Are you sure you want to delete");
    if (prompt) {
      try {
        setDeleteLoading(true);
        const route = location.pathname.split("/")[2];
        const res = await fetch(
          `${backendUrl}/notes?route=${route}&editPassword=${auth.password}`,
          { method: "DELETE" }
        );
        const data = await res.json();

        if (res.status !== 200) {
          return;
        }
        setAuth({
          isValid: false,
          password: null,
        });
        navigate("/");
        return;
      } catch (error) {
        navigate("/");
      } finally {
        setDeleteLoading(false);
      }
    }
    return;
  }

  async function SaveNotes() {
    try {
      setSaveLoading(true);
      const response = await fetch(`${backendUrl}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: location.pathname.split("/")[2],
          editPassword: auth.password,
          notes: data,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      const responseData = await response.json();
    } catch (error) {
      alert(error);
    } finally {
      setSaveLoading(false);
    }
  }

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

  const handleChange = (content, tab) => {
    const newData = [...data];
    const tabIndex = newData.findIndex((item) => item.id === tab.id);
    newData[tabIndex] = { ...newData[tabIndex], content };
    setData(newData);
  };

  return (
    <div>
      <Navbar
        SaveNotes={SaveNotes}
        saveLoading={saveLoading}
        ChangePassword={ChangePassword}
        DeleteRoute={DeleteRoute}
        deleteLoading={deleteLoading}
      />
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
                  <p
                    onClick={() => {
                      setActiveEdit({ id: tab.id, name: tab.tabName });
                      onOpen();
                    }}
                  >
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
                  setData([...tempArr]);
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
                    onChange={(content) => handleChange(content, tab)}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </div>
      </div>
      <Modal
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        onClose={onClose}
      >
        <OverlayOne />
        <ModalContent>
          <ModalHeader>Edit And Delete tabs</ModalHeader>
          <ModalBody>
            <p className="text-primaryText pb-4">Edit Your Tab Name</p>
            <Input
              onChange={(e) => setEditText(e.target.value)}
              type="text"
              defaultValue={activeEdit?.name}
            />
          </ModalBody>
          <ModalFooter gap={4}>
            <Button
              onClick={() => {
                let tempArr = [...data];
                const tabIndex = tempArr.findIndex(
                  (item) => item.id === activeEdit.id
                );
                if (tabIndex !== -1) {
                  tempArr[tabIndex] = {
                    ...tempArr[tabIndex],
                    tabName:
                      editText.trim() === "" ? "Empty Tab" : editText.trim(),
                  };
                  setData(tempArr);
                  setActiveEdit(null);
                  onClose();
                }
              }}
              colorScheme="green"
            >
              Edit Text
            </Button>

            <Button
              onClick={() => {
                let tempArr = [...data];
                const tabIndex = tempArr.findIndex(
                  (item) => item.id === activeEdit.id
                );
                if (tabIndex !== -1) {
                  tempArr.splice(tabIndex, 1);
                  setData(tempArr);
                  setActiveEdit(null);
                  onClose();
                }
              }}
              colorScheme="red"
            >
              Delete tab
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export const NewNotes = () => {
  const [auth, setAuth] = useRecoilState(authHook);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([
    {
      id: uuidv4(),
      tabName: "Empty Tab",
      content: `Loading...`,
    },
  ]);
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
    if (!auth.isValid) {
      onOpen();
    }
  }, [auth.isValid]);

  async function getNotes(password) {
    try {
      const res = await fetch(
        `${backendUrl}/notes?route=${
          location.pathname.split("/")[2]
        }&editPassword=${password}`
      );
      const data = await res.json();
      if (res.status === 404) {
        navigate(`/${location.pathname.split("/")[2]}`);
        return;
      }
      if (res.status === 401) {
        alert("Unauthorized");
        return;
      }
      if (res.status === 402) {
        return;
      }
      setData(data.notes);
    } catch (error) {}
  }

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
      setAuth({
        isValid: true,
        password: password,
      });
      getNotes(password);
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
      {auth.isValid && <EditNotes data={data} setData={setData} />}
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
