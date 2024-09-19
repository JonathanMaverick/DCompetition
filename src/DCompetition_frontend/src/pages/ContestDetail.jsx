import { useParams } from "react-router-dom";
import { FaTrophy, FaUsers } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import BottomCard from "../components/BottomCard";

function ContestDetail() {

     const { competitionID } = useParams();

     const iconColors = {
          "Not Started": "text-gray-400",
          Ongoing: "text-purple-300",
          "Winner Selection": "text-purple-200",
          Completed: "text-fuchsia-200",
     };

     const titleColors = {
          "Not Started": "text-gray-100",
          Ongoing: "text-purple-100",
          "Winner Selection": "text-purple-50",
          Completed: "text-fuchsia-100",
     };

     const targetDate = new Date("Fri Sep 20 2024 11:14:29 GMT+0700");
     
     return ( 
          <div className="flex w-full gap-x-4">
               <div className="flex flex-col w-2/5 h-full gap-y-3">
                    <div className="py-3 px-4 gap-1 h-1/5">
                         <div className="text-4xl font-medium text-left">
                              Contest Name
                         </div>
                         <div className="text-1xl font-medium text-left pl-1">
                              Contest Category
                         </div>
                    </div>
                    <BottomCard
                        reward="1000"
                        submissions="20"
                        deadline=""
                        status="Not Started"
                    />
                    <div className="bg-black bg-opacity-40 rounded-lg p-4 gap-1 flex flex-col ">
                         <div className="text-xl font-semibold">
                              Description :
                         </div>
                         <div className="text-sm text-justify">
                              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt harum dicta iste veniam sit illum consequuntur corporis deleniti. Dolores quis officiis fugit reprehenderit excepturi dolorem explicabo ducimus modi officia quam deserunt similique minima reiciendis quibusdam ipsam, unde tenetur repellat vel blanditiis laboriosam laborum! Fuga iusto quas id vitae autem. Facere, iste quasi aspernatur repellat sequi vitae. Nisi iure, repudiandae dolore deserunt labore laborum harum, beatae aliquam commodi, magnam similique corrupti animi ratione asperiores! Tenetur minima repudiandae fugiat iste eum quasi aut doloribus quia soluta veniam magni maiores molestiae dolore cumque officiis qui pariatur dolores, officia ad dicta! Doloribus, repudiandae officia.
                         </div>
                    </div>
                    <div className="bg-purple-600 font-semibold h-10 w-full text-center flex items-center justify-center rounded-lg">
                         Join
                    </div>
               </div>
               <div className="w-3/4 bg-black bg-opacity-40 h-full rounded-lg justify-center items-center overflow-y-scroll p-6">
                    <div className="h-5/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 w-full justify-items-center">
                         {Array.from({ length: 7 }).map((_, idx) => (
                              <div className="bg-opacity-40 flex flex-col items-center justify-center gap-y-2 p-3">
                                   <div className="text-sm font-semibold">
                                        username
                                   </div>
                                   <img
                                        src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                                        className="w-52 h-52 rounded-lg shadow-lg transition-transform transform hover:scale-[1.02] cursor-pointer"
                                   />
                              </div>
                         ))} 
                    </div>
               </div>
          </div>
     )
}

export default ContestDetail;