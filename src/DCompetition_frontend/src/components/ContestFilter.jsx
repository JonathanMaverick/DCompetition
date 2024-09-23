import React, { useEffect, useState } from "react";
import { Autocomplete, AutocompleteItem, Input } from "@nextui-org/react";
import { IoIosSearch } from "react-icons/io";

function ContestFilter({ contests, setFilteredContests }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const categories = [
    { label: "All Category", value: "" },
    { label: "Logo", value: "logo" },
    { label: "Poster", value: "poster" },
    // { label: "Design", value: "design" },
    { label: "Infographic", value: "infographic" },
  ];

  const statuses = [
    { label: "All Status", value: "" },
    { label: "Not Started", value: "Not Started" },
    { label: "Ongoing Contest", value: "Ongoing" },
    { label: "Winner Selection", value: "Winner Selection" },
    { label: "Completed Contest", value: "Completed" },
  ];

  const applyFilters = () => {
    let filtered = contests;

    if (searchTerm) {
      filtered = filtered.filter((contest) =>
        contest.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (contest) => contest.category === selectedCategory
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(
        (contest) => contest.status === selectedStatus
      );
    }

    setFilteredContests(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedStatus, contests]);

  return (
    <div className="filter-section w-full md:w-1/4 flex flex-col gap-4">
      <Input
        type="text"
        label="Search Contest"
        placeholder="Enter a Contest Title"
        variant="bordered"
        className="backdrop-blur-lg"
        labelPlacement="outside"
        value={searchTerm}
        onValueChange={setSearchTerm}
        endContent={
          <button className="focus:outline-none" type="button">
            <IoIosSearch className="text-xl" />
          </button>
        }
      />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm">Category</p>
        <Autocomplete
          // label="Category"
          placeholder="All Category"
          defaultItems={categories}
          labelPlacement="outside"
          variant="bordered"
          className="backdrop-blur-lg"
          onSelectionChange={setSelectedCategory}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm">Status</p>{" "}
        <Autocomplete
          // label="Status"
          placeholder="All Status"
          defaultItems={statuses}
          labelPlacement="outside"
          variant="bordered"
          className="backdrop-blur-md"
          onSelectionChange={setSelectedStatus}
        >
          {(item) => (
            <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </div>
  );
}

export default ContestFilter;
