import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export const NewNotes = () => {
  const [tabs, setTabs] = useState([
    { id: 1, name: "Tab1" },
    { id: 2, name: "Tab2" },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [text, setText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  function SaveNotes() {
    onOpen();
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

  return (
    <div>
      <Navbar SaveNotes={SaveNotes} />
      <div className="container py-8">
        <div>
          <h1 className="text-2xl text-primaryText font-semibold py-4 title tracking-wider">
            Create a new Note
          </h1>
          <div className="flex w-full gap-4 overflow-scroll rm-scroll">
            {tabs.map((tab) => (
              <p
                key={tab.id}
                className={`px-4 py-1 ${
                  activeTab === tab.id
                    ? "bg-primaryText text-white border-red-300"
                    : "bg-slate-50 "
                } rounded-t-md cursor-pointer transition-all border-t-2`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.name}
              </p>
            ))}
          </div>
          <div className=" w-full h-[65vh] rounded-b-md ">
            <ReactQuill
              modules={modules}
              theme="snow"
              value={text}
              onChange={setText}
            />
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-[#ea5252]">Save Notes</ModalHeader>
          <ModalBody>
            <p>Create a Password for Both Edit Access and View Access</p>
            <div className="py-4">
              <p>Password for Edit Access</p>
              <Input type="password" />
            </div>
            <div>
              <p>Password for View Access</p>
              <Input type="password" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                // Navigate("/");
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
              Create Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
