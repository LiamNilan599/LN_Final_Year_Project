import NewMeetupForm from '../Components/NewMeetupForm';
import { useHistory } from 'react-router-dom';
import React from 'react'
function NewMeetupPage() 
{
  const history = useHistory();
  function addMeetupHandler(meetupData)
  {
    fetch(
      'https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/meetups.json',
      {
        method: 'POST',
        body: JSON.stringify(meetupData),
        headers: 
        {
          'Content-Type': 'application/json'
        }
      }
    ).then(() => {
      history.replace('/');
    });
  }
  return (
    <section>
      <h1>Add New Meetup</h1>
      <NewMeetupForm onAddMeetup={addMeetupHandler}/>
    </section>
  );
}
  
  export default NewMeetupPage;