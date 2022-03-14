import { useRef } from 'react';
import { Button } from '@nextui-org/react';

function DeleteModal(props) {

  const pass1InputRef = useRef();
  const pass2InputRef = useRef();

  function cancelHandler() {
    props.onCancel();
  }

  function Verification(data) {

    if (data.password != data.pass2) {
      alert("Passwords are not the same");
      return false;
    }
    else {
      return true;
    }
  }

  function submitHandler(event) {
    event.preventDefault();
    const enteredPass1 = pass1InputRef.current.value;
    const enteredPass2 = pass2InputRef.current.value;

    const passwordData = {
      password: enteredPass1,
      pass2: enteredPass2
    };

    if (Verification(passwordData) == true) {
      fetch('http://localhost:3030/delete-account',
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify(passwordData)
        }
      )
        .then((response) => {
          if (!response.ok) {
            alert("Invalid password")
          }
          else {
            props.onDelete();
            return response.json();
            
          }

        })
        .catch((err) => {
          console.log(err.message);
        });

    }
  }
  return (
    <div>
      <div className='modal'>
        <h3> Delete Account? </h3>
        <form className='form'>
          <div className='control'>
            <label htmlFor='pass1'>Enter Password</label>
            <input type='Password' required id='pass1' ref={pass1InputRef} />
          </div>
          <div className='control'>
            <label htmlFor='pass2'>Enter Password again</label>
            <input type='Password' required id='pass2' ref={pass2InputRef} />
          </div>

          <div>
            <Button.Group size="sm">
              <Button onClick={submitHandler} css={{ backgroundColor: '#008805' }} auto>Confirm Delete</Button>
              <Button onClick={cancelHandler} css={{ backgroundColor: '#008805' }} auto>Cancel</Button>
            </Button.Group>
          </div>
        </form>

      </div>
    </div>
  );
}
export default DeleteModal;