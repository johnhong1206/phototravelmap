--This is The website call photo travel map

#This website built by NextJS, Sanity,tailwind CSS, Geoapify and react-map-gl
1) the main functions of this website is to present and share my photo which related to food photo and travel
2) all of the post able to shown on the map
3) user able to filter and find the photo on the map
4) by refering the info, user able to create own travel plans

#current release funtion for public---
  1) post rating function
  2) filter photo by tag
  3) creaate travel plans
  4) find info on the maps

#user guide
  1) sign up an account
  2) click the photo on main page to view the post details
  3) rate the photo
  4) click the category or location to find related post
    4.1) from location section click the refreh icon to get area info for the post,such as similar restaurant , accomodation entertaiment etc...
  5) click the utensils icon and nav to food page
    5.1) this page will show the post related to food
    5.2) user can filter or search the post by tag
  6) click the camera icon and nav to travel page
    6.1) this page will show the post related to travel and photo
    6.2) user can filter or search the post by tag
  7) Click the board icons and nav to travel plan page
    7.1) this page allow user to create own travel plan
    7.2) user should fill in the title date and location to create the travel plans
    7.3) if the location not exist on database use can click the plus icon to open modal to search the location
        7.3.1) when open the modal user able to search the location and fill in the form in order to create the locattion
    7.4) when all requirement filled, the travel plans can created
    7.5) click the card and nav to travel plans
 8) in travel plans detail pagge
  8.1) for the suggestion first step
      8.1.1) click the 'click for the info' button to get the location area info
  8.2) user should fill in the title date, time and location to create the travel plans
  8.3) if the location not exist on database use can click the plus icon to open modal to search the location (steps are same as section above)
  8.4) after submit the plan be patient or click the refresh icon on the title to get the plan details
      8.4.1) if the plan did not update click back button on web browser and nav in the page again
      8.4.2) after the first plan details created, the red mark will shown on the map
  8.5) user can click on the red mark to open the modal
  8.6) user can click on the 'get area info' purple button to fetch default area infomation for the first place
     8.6.1) the infomation will be related to food, accomodation,toutism entertaiment,heritage
          8.6.1.1) the areainfomation will the location which 5km near the first place
     8.6.2) user can click any  color icon and then on the 'get area info' purple button to find specific area info
          8.6.2.1) he infomation will be specific where refer to which icon you click
          8.6.2.2) click the icons on the map to the popup will shown
          8.6.2.3) click the text to open the modal to look for infomation
  8.7) with the area info user can used as reference to look for second place of the trips
  8.8) if favourite location not exist on the database
      8.8.1) click the icons on the map to the popup will shown
      8.8.2) click the text to open the modal to look for infomation
      8.8.3) click the blue add icons to open the location modal to add the location
          8.8.3.1) after submit the location be patient or click the refresh icon on the title to get the plan details
          -- if the plan did not update click back button on web browser and nav in the page again

--future release plan
 1) release public to post the photo or post
 2) more advance filter function
 3) edit page for the post to update post details
 4) edit page for travel plans
 5) user profile page
 6) routing on the map

  
  
-- technical limitation
1) due to free using the api,the searh result are limited
  
    
    

  
