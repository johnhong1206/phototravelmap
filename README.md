--This is The website call photo travel map
    This website built by NextJS, Sanity,tailwind CSS, Geoapify and react-map-gl
--the main functions of this website is to present and share my photo which related to food photo and travel
-- all of the post able to shown on the map
-- user able to filter and find the photo on the map
-- by refering the info, user able to create own travel plans

---current release funtion for public---
-- rate the photo/post
--filter out the photo
--creaate travel plans
--find info on the maps

---user guide
--sign up an account
--click the photo on main page to view the post details
  ---rate the photo
  ---click the category or location to find related post
--from location section click the refreh icon to get area info for the post
    --such as similar restaurant , accomodation entertaiment etc...

--click the utensils icon and nav to food page
  -- this page will show the post related to food
  -- user can filter or search the post by tag

--click the camera icon and nav to travel page
  -- this page will show the post related to travel and photo
  -- user can filter or search the post by tag

--click the board icons and nav to travel plan page
  -- this page allow user to create own travel plan
  -- user should fill in the title date and location to create the travel plans
  -- if the location not exist on database use can click the plus icon to open modal to search the location
    when open the modal user able to search the location and fill in the form in order to create the locattion
  --when all requirement filled, the travel plans can created
  --click the card and nav to travel plans

--in travel plans detail pagge
  for the suggestion first step
      --click the 'click for the info' button to get the location area info
  -- user should fill in the title date, time and location to create the travel plans
    -- if the location not exist on database use can click the plus icon to open modal to search the location (steps are same as section above)
  -- after submit the plan be patient or click the refresh icon on the title to get the plan details
      -- if the plan did not update click back button on web browser and nav in the page again
  --after the first plan details created, the red mark will shown on the map
    -- user can click on the red mark to open the modal
    -- user can click on the 'get area info' purple button to fetch default area infomation for the first place
        -- the infomation will be related to food, accomodation,toutism entertaiment,heritage
        -- the areainfomation will the location which 5km near the first place
    --user can click any  color icon and then on the 'get area info' purple button to find specific area info
      --  -- the infomation will be specific where refer to which icon you click
    --click the icons on the map to the popup will shown
      --click the text to open the modal to look for infomation
  --with the area info user can used as reference to look for second place of the trips
  --if favourite location not exist on the database
    --click the icons on the map to the popup will shown
        --click the text to open the modal to look for infomation
        --click the blue add icons to open the location modal to add the location
       -- after submit the location be patient or click the refresh icon on the title to get the plan details
          -- if the plan did not update click back button on web browser and nav in the page again

--future release plan
 release public to post the photo or post
  more advance filter function
  
  
-- technical limitation
  -- will make more page run real times
  --due to free using the api,the searh result are limited
  
    
    

  
