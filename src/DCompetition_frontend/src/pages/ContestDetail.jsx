import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../style/DotsStyle.css"

function ContestDetail() {

     const { competitionID } = useParams();

     const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true, 
          autoplaySpeed: 3000,
          arrows: false,
          dotsClass: "slick-dots custom-dots"
     };
     
     return ( 
          <div className="flex w-full h-[80vh] gap-x-4">
               <div className="flex flex-row w-2/5 bg-black bg-opacity-40 h-full rounded-lg justify-center">
                    <div className="bg-blue-500 w-5/6 h-64">
                         <Slider {...settings}>
                              <img className="h-64"
                                   src="https://ik.imagekit.io/tvlk/blog/2020/01/shutterstock_404607271.jpg?tr=dpr-2,w-675" alt="Image 1" />

                              <img className="h-64" 
                                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAAG02k9uomeIqLlL37tXK8blgKyF_8umwOw&s" alt="Image 2" />

                              <img className="h-64" 
                                   src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu9IzVXuIhhPxFcaa-oqrNKlPiUtDC8CBwPA&s" alt="Image 3" />
                         </Slider>
                    </div>
                    {/* <div className="bg-green-500 w-full h-64">
                         
                    </div> */}
               </div>
               <div className="w-3/5 bg-black bg-opacity-40 h-full rounded-lg">

               </div>
          </div>
     )
}

export default ContestDetail;