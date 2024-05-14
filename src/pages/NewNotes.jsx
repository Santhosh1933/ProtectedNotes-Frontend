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
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import { GoKebabHorizontal } from "react-icons/go";
import { useRecoilState } from "recoil";
import { noteState } from "../hooks/NotesHook";

export const NewNotes = () => {
  const [data, SetData] = useRecoilState(noteState);
  const [activeTab, setActiveTab] = useState(data[0].id);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passwords, setPasswords] = useState({
    viewPassword: "",
    editPassword: "",
  });

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  }

  function SaveNotes() {
    onOpen();
    console.log(passwords);
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

  useEffect(() => {
    setActiveTab(data[0].id);
  }, [data.length]);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <div>
      <Navbar SaveNotes={SaveNotes} />
      <div className="container py-8">
        <div>
          <h1 className="text-2xl text-primaryText font-semibold py-4 title tracking-wider">
            Create a new Note
          </h1>
          <div className="flex w-full gap-4  overflow-scroll rm-scroll">
            {data.map((tab) => (
              <Menu key={tab.id}>
                <div
                  className={`px-4 py-1 ${
                    activeTab === tab.id
                      ? "bg-primaryText text-white border-red-300"
                      : "bg-slate-50 "
                  } rounded-t-md cursor-pointer transition-all border-t-2 flex items-center `}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                >
                  <p key={tab.id}>{tab.tabName}</p>
                  <MenuButton>
                    <GoKebabHorizontal className="rotate-90" />
                  </MenuButton>
                </div>
                <MenuList className="p-4 flex flex-col gap-2">
                  <Input
                    defaultValue={tab.tabName}
                    onChange={(e) => {
                      const newName = e.target.value;
                      if (newName.length <= 15) {
                        SetData((prevTabs) =>
                          prevTabs.map((prevTab) =>
                            prevTab.id === tab.id
                              ? { ...prevTab, tabName: newName }
                              : prevTab
                          )
                        );
                      }
                      if (!newName.trim()) {
                        SetData((prevTabs) =>
                          prevTabs.map((prevTab) =>
                            prevTab.id === tab.id
                              ? { ...prevTab, tabName: "Empty Tab" }
                              : prevTab
                          )
                        );
                      }
                    }}
                  />

                  <MenuItem
                    as={Button}
                    onClick={() => {
                      if (data.length !== 1) {
                        SetData((prevTabs) =>
                          prevTabs.filter((prevTab) => prevTab.id !== tab.id)
                        );
                      }
                      setActiveTab(data[0].id);
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            ))}
            <p
              className="px-4 py-1 bg-slate-50 
                 rounded-t-md cursor-pointer transition-all border-t-2"
              onClick={() => {
                let tabId = uuidv4();
                SetData((pre) => [
                  ...pre,
                  { id: tabId, tabName: `Empty Tab`, content: "" },
                ]);
              }}
            >
              <BiPlus />
            </p>
          </div>
          <div className=" w-full h-[65vh] rounded-b-md ">
            <ReactQuill
              modules={modules}
              theme="snow"
              value={data.find((content) => content.id === activeTab)?.content}
              onChange={(content) => {
                const newData = [...data];
                console.log(newData)
                const tabIndex = newData.findIndex(
                  (item) => item.id === activeTab
                );
                newData[tabIndex] = { ...newData[tabIndex], content: content };
                SetData(newData);
              }}
            />
          </div>
        </div>
      </div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-[#ea5252]">Save Notes</ModalHeader>
          <ModalBody>
            <p>Create a Password for Both Edit Access and View Access</p>
            <div className="py-4">
              <p>Password for Edit Access</p>
              <Input
                type="password"
                name="editPassword"
                value={passwords.editPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <p>Password for View Access</p>
              <Input
                type="password"
                name="viewPassword"
                value={passwords.viewPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                setPasswords({
                  viewPassword: "",
                  editPassword: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                // Navigate("/new/s");
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
