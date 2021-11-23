import { useEffect, useState } from "react";
import { IPost } from "../interfaces/blogPost.interface";
import MainService from "../services/main.service";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import SwiperCore, {
  Navigation,Mousewheel
} from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/components/navigation/navigation.min.css';
import 'swiper/components/pagination/pagination.min.css';

SwiperCore.use([
  Navigation,
  Mousewheel,
]);

// const styleSection: any  = {
// 	'background-image': "url('./assets/img/background.png')",
// };

const Hero: React.FC<{}> = (props) => {
	const [posts, setPosts] = useState<IPost[]>();
	
  useEffect(() => {
		const fetchPosts = async () => {
      const postsData = await MainService.fetctPosts();
      console.log (postsData);
      setPosts(postsData.items);
    }
		fetchPosts();
	}, [])

	const postCard = (post: IPost) => {
    console.log (post)
    const goToPost = () => {
      window.location.href = post.link;
    };

    return (
      <SwiperSlide className="flex rounded-2xl cursor-pointer bg-center bg-cover" key={post.link}
        onClick={goToPost} style={{backgroundImage: `url(${post.thumbnail})`}}
      > 
        {/* <div className="h-2/3"></div> */}
        <div className="overflow-hidden self-end w-full h-1/3 p-3 m-3  bg-white rounded-xl">
          <p className="text-xs lg:text-lg text-gray-600">{post.categories[0].toUpperCase()}</p>
          <h1 className="leading-none tracking-tighter lg:leading-none lg:tracking-tighter lg:text-2xl font-semibold text-gray-700">
            {post.title}
          </h1>
        </div>      
      </SwiperSlide>
  
    )

  }

		
	return (
		<div className="flex h-screen bg-fixed opacity-90" >
			<div className="lg:flex m-auto w-full">
				<div className="flex self-center w-full lg:w-1/2">
					<img className="rounded-full w-2/5 lg:w-6/12 mx-auto"
						src="./assets/img/anderson.jpg"
						alt="Anderson Laverde"
					/>
				</div>

				<div className="w-full lg:w-1/2 ">	
          <div className="p-4 flex flex-wrap">
            <div className="lg:w-8/12">
              <h1 className="text-gray-800 font-extrabold text-4xl lg:text-7xl leading-none tracking-tighter">
                Anderson Laverde Gracia 🇨🇴
              </h1>
            </div>
            <div className="lg:w-8/12">
              <p className="mt-2 text-gray-800 text-2xl leading-none tracking-tighter">
                CEO at <b>@Slinqer</b>, Engineer developing tech products to decrease carbon emissions🌲.
              </p>
            </div>
          </div>
          <div className="ml-4">
            <h2 className="text-gray-800 text-3xl font-bold ">Last Posts</h2>
            <Swiper
              className="h-60 lg:h-72 mt-2"
              navigation={true}
              mousewheel={true}
              spaceBetween={20}
              slidesPerView={1.4}
            >
              {posts && posts.map(post => postCard(post))}
            </Swiper>
          </div>
										
				</div>
			</div>
		</div>
	);
}
export default Hero;
