import { Label, TextInput, Button } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { useState } from "react";
import GradientButton from "./GradientButton";

export function FindTutorForm({ onFilter }) {
  const [classInput, setClassInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(classInput, subjectInput);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full">
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <TextInput
            id="class"
            type="text"
            placeholder="Enter your class"
            required
            value={classInput}
            onChange={(e) => setClassInput(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <TextInput
            id="subject"
            type="text"
            placeholder="Enter your subject"
            required
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
          />
        </div>
        <GradientButton
          type="submit"
          className="mt-2"
          rightIcon={<HiSearch className="ml-2" />}
        >
          Find Tutor
        </GradientButton>
      </div>
    </form>
  );
}
