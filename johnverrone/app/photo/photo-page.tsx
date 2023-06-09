'use client';

import { AppContainer } from '@components/AppContainer';
import { WheelNav } from '@components/Navigation';
import { PhotoList } from '@components/PhotoList';
import styled from '@emotion/styled';
import Image from 'next/image';

const images = [
  {
    src: '20220622-DJI_0141.jpg',
    alt: 'The village of Bovec, Slovenia during golden hour',
  },
  {
    src: '20220621-JV_05480.jpg',
    alt: 'Treetops with a mountain towering in the distance near Bovec, Slovenia',
  },
  {
    src: '20220620-JV_05411.jpg',
    alt: 'The top of a buildig in Bovec, Slovenia',
  },
  {
    src: '20220620-JV_05339.jpg',
    alt: 'Lake Bled in Slovenia with iconic island castle',
  },
  {
    src: '20220614-JV_05333.jpg',
    alt: 'Antinori',
  },
  {
    src: '20220614-JV_05280.jpg',
    alt: 'A reflection of the entrance to Antinori',
  },
  {
    src: '20220614-JV_05258.jpg',
    alt: 'The iconic staircase at Antinori in Tuscany',
  },
  {
    src: '20220227-JV_04858.jpg',
    alt: '4Runner tucked in a snowy rock formation in Zion National Park',
  },
  {
    src: '20220227-JV_04847.jpg',
    alt: 'Snow on a rock formation in Zion National Park',
  },
  {
    src: '20220227-JV_04825.jpg',
    alt: 'Zion National Park overlook',
  },
  {
    src: '20220226-JV_04396.jpg',
    alt: 'Coffee machine and drone on the kitchen counter of a tiny home',
  },
  {
    src: '20220226-DJI_0079.jpg',
    alt: 'Tiny home outside of Zion National Park',
  },
  {
    src: '20211120-JV_03888.jpg',
    alt: 'Capitol Reef National Park in Utah',
  },
  {
    src: '20211031-JV_02430.jpg',
    alt: 'Golf course of Redlands Mesa',
  },
  {
    src: '20211031-JV_02415.jpg',
    alt: 'Molly hitting a golf ball at Redlands Mesa',
  },
  {
    src: '20211031-JV_02409.jpg',
    alt: 'Golf course of Redlands Mesa',
  },
  {
    src: '20211031-JV_02402.jpg',
    alt: 'Golf course of Redlands Mesa',
  },
  {
    src: '20211031-JV_02393.jpg',
    alt: 'Golf course of Redlands Mesa',
  },
  {
    src: '20211031-JV_02384.jpg',
    alt: 'Golf course of Redlands Mesa',
  },
  {
    src: '20210830-DJI_0050.jpg',
    alt: 'Golf course of Dumbarnie Links',
  },
  {
    src: '20210829-IMG_2424.jpg',
    alt: 'Golf course of Gullane',
  },
  {
    src: '20210828-IMG_2379.jpg',
    alt: 'Golf course of Dumbarnie Links',
  },
  {
    src: '20210828-IMG_2362.jpg',
    alt: 'Golf course of Dumbarnie Links',
  },
  {
    src: '20210828-IMG_2356.jpg',
    alt: 'Golf course of Dumbarnie Links',
  },
  {
    src: '20210825-DJI_0039.jpg',
    alt: 'Drone shot of the first and eighteenth holes at Ardglass',
  },
  {
    src: '20210824-IMG_2165.jpg',
    alt: 'A par 3 golf hole in Ballyliffin, Ireland',
  },
  {
    src: '20210807-IMG_1848.jpg',
    alt: 'Mountains near Maroon Bells in Colorado',
  },
  {
    src: '20210725-JV_02043.jpg',
    alt: 'Hanging Lake in Colorado',
  },
  {
    src: '20210724-JV_01998.jpg',
    alt: 'Flowers in Steamboat Springs, CO',
  },
  {
    src: '20210724-JV_01976.jpg',
    alt: 'Plants in Steamboat Springs, CO',
  },
  {
    src: '20210717-JV_01851.jpg',
    alt: 'Longs Peak in Colorado',
  },
  {
    src: '20210710-JV_01101.jpg',
    alt: 'Camp setup with paddleboards',
  },
  {
    src: '20210710-JV_01094.jpg',
    alt: 'A piece of driftwood on the beach of a reservoir in Wyoming',
  },
  {
    src: '20210709-JV_01068.jpg',
    alt: 'A sunset on a reservoir in Wyoming with paddleboards in the foreground',
  },
  {
    src: '20210709-JV_01013.jpg',
    alt: 'Paddleboards on a reservoir in Wyoming',
  },
  {
    src: '20210616-JV_00807.jpg',
    alt: 'John and Molly on the summit of Mt. Evans',
  },
  {
    src: '20210605-JV_00520.jpg',
    alt: 'Golf hole surrounded by old wooden sheds',
  },
  {
    src: '20210605-JV_00515.jpg',
    alt: 'Golf hole in the distance beyond a pond and tall grass',
  },
  {
    src: '20201219-GPTempDownload.jpg',
    alt: 'Molly skiing in Breckenridge, CO',
  },
  {
    src: '20200922-IMG_0593.jpg',
    alt: 'Bike leaned on Jackson St. bridge with the Atlanta skyline behind',
  },
  {
    src: '20200829-JV_09861.jpg',
    alt: 'John and Molly cheersing some wine in a treehouse',
  },
  {
    src: '20200829-JV_09627.jpg',
    alt: 'Pour over coffee being brewed',
  },
  {
    src: '20200711-JV_09166.jpg',
    alt: 'Burrata appetizer at Pinewood Social',
  },
  {
    src: '20200711-JV_09162.jpg',
    alt: 'Pinewood Social in Nashville, TN',
  },
  {
    src: '20200611-JV_09111.jpg',
    alt: 'Beach at sunrise',
  },
  {
    src: '20200429-JV_09005.jpg',
    alt: 'Tacos',
  },
  {
    src: '20200427-JV_08921.jpg',
    alt: 'Enchiladas',
  },
  {
    src: '20200422-JV_08848.jpg',
    alt: 'Curry meatballs from Half Baked Harvest',
  },
  {
    src: '20200323-JV_08745.jpg',
    alt: 'Pouring coffee into a mug',
  },
  {
    src: '20200323-JV_08739.jpg',
    alt: 'John holding a Chemex',
  },
  {
    src: '20200202-JV_01420.jpg',
    alt: 'John and Molly on the bed inside a Getaway Cabin',
  },
  {
    src: '20190715-DSC08308.jpg',
    alt: 'Vineyards in Napa, CA',
  },
  {
    src: '20190617-IMG_2422.jpg',
    alt: 'La Marzocco espresso machine at East Pole Coffee Co. in Atlanta, GA',
  },
  {
    src: '20190322-DSC07453.jpg',
    alt: 'Light hitting plants on a bar cart with polaroids, bar tools, and a candle',
  },
  {
    src: '20190312-DSC07433.jpg',
    alt: 'Chemex',
  },
  {
    src: '20190221-DSC07237.jpg',
    alt: 'Sea lion on the Galapagos Islands',
  },
  {
    src: '20190219-DSC06705.jpg',
    alt: 'Pelican on the Galapagos Islands',
  },
  {
    src: '20190219-DSC06539.jpg',
    alt: 'Iguana on the Galapagos Islands',
  },
  {
    src: '20190219-DSC06496.jpg',
    alt: 'Palm trees on the Galapagos Islands in Ecuador',
  },
  {
    src: '20190219-DSC06488.jpg',
    alt: 'Boats off the coast of the Galapagos Islands in Ecuador',
  },
  {
    src: '20190219-DSC06486.jpg',
    alt: 'Boats off the coast of the Galapagos Islands in Ecuador',
  },
  {
    src: '20190209-DSC06007.jpg',
    alt: 'Silky long exposure photo of a waterfall in North Georgia',
  },
  {
    src: '20190123-DSC05949.jpg',
    alt: 'John and Molly in the Inifinity Mirrors exhibit',
  },
  {
    src: '20181210-IMG_0822.jpg',
    alt: 'Seattle Space Needle',
  },
  {
    src: '20181008-DSC04860.jpg',
    alt: 'Coffee beans in a bag',
  },
  {
    src: '20181007-DSC04820.jpg',
    alt: 'Silhouetted skateboarder doing a trick during golden hour at Venice Beach',
  },
  {
    src: '20181007-DSC04777.jpg',
    alt: 'Molly wearing sunglasses looking off camera during golden hour at Venice Beach',
  },
  {
    src: '20181004-IMG_0023.jpg',
    alt: 'Top down shot of a latte with pretty art',
  },
  {
    src: '20181004-DSC04524.jpg',
    alt: 'Sunflowers in a vase on a kitchen table',
  },
  {
    src: '20180624-DSC02724.jpg',
    alt: 'Bryce Canyon framed between trees',
  },
  {
    src: '20180623-DSC02355.jpg',
    alt: 'Shelby and Taylor smiling from the backseat of the minivan',
  },
  {
    src: '20180622-LRG_DSC02012.jpg',
    alt: 'Horeshoe Bend during golden hour',
  },
  {
    src: '20180622-DSC01941.jpg',
    alt: 'Updward shot from inside the slot canyons of Lower Antelope Canyon',
  },
  {
    src: '20180622-DSC01822.jpg',
    alt: 'John pointing at the camera through the mirror in the car',
  },
  {
    src: '20180622-DSC01732.jpg',
    alt: 'Grand Canyon',
  },
  {
    src: '20180622-DSC01724.jpg',
    alt: 'Hiking boots and camp stove on a table',
  },
  {
    src: '20180621-DSC01675.jpg',
    alt: 'John at the Grand Canyon',
  },
  {
    src: '20180621-DSC01360.jpg',
    alt: 'Driving into Sedona, AZ',
  },
  {
    src: '20180621-DSC01245.jpg',
    alt: 'Eric looking off camera at a coffee shop',
  },
  {
    src: '20180601-DSC00987.jpg',
    alt: 'Wes posing with sunglasses in New Orleans, LA',
  },
  {
    src: '20180401-IMG_2273.jpg',
    alt: 'Feet of sleeping bag inside tent with view of morning smog over nearby pond',
  },
  {
    src: '20180323-IMG_2109.jpg',
    alt: 'East Pole coffee mug with carafe behind it',
  },
  {
    src: '20180303-DSC_0642.jpg',
    alt: 'Eric in the woods',
  },
  {
    src: '20180223-DSC_0186.jpg',
    alt: 'Red Rocks, CO with snow',
  },
  {
    src: '20180211-DSC_9994.jpg',
    alt: 'Fire escape on a building in downtown Atlanta',
  },
  {
    src: '20180211-DSC_0028.jpg',
    alt: 'Eric on a parking deck',
  },
  {
    src: '20180121-DSC_9733.jpg',
    alt: 'Soccer ball in dirt',
  },
  {
    src: '20170929-IMG_3563.jpg',
    alt: 'Boston skyline at sunset',
  },
];

const CollectionWrapper = styled.div`
  margin-bottom: 48px;
`;

const PhotoPage = () => {
  return (
    <>
      <WheelNav />
      <AppContainer>
        <CollectionWrapper>
          <PhotoList>
            {images.map((i) => (
              <Image
                key={i.src}
                src={`https://wnnjdgkrwtehvvxfqohk.supabase.co/storage/v1/object/public/portfolio/${i.src}`}
                alt={i.alt}
                width={600}
                height={800}
                style={{
                  height: 'auto',
                  objectFit: 'cover',
                  aspectRatio: '3/4',
                }}
              />
            ))}
          </PhotoList>
        </CollectionWrapper>
      </AppContainer>
    </>
  );
};

export default PhotoPage;
