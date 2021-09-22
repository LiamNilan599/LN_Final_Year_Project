import { useRef } from 'react';
function NewEmployeeModal(props) {

    
    function cancelHandler() {
        props.onCancel();
    }

    const nameInputRef = useRef();
    const ageInputRef = useRef();
    const roleInputRef = useRef();
    const ppsnInputRef = useRef();
    const wageInputRef = useRef();

    function submitHandler(event) {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredAge = ageInputRef.current.value;
        const enteredRole = roleInputRef.current.value;
        const enteredPpsn = ppsnInputRef.current.value;
        const enteredWage = wageInputRef.current.value;

        
        const employeeData = {
            name: enteredName,
            age: enteredAge,
            role: enteredRole,
            ppsn: enteredPpsn,
            wage: enteredWage,
        };

        console.log(employeeData);
        props.onAddEmployee(employeeData);
    }
    return (
        // <div className='modal'>
        //     <div id="empModal" className="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">

        //     {/* <!-- Modal content --> */}
        //         <div class="modal-content">
        //             <div class="modal-header">
        //                 <h5 class="modal-title">New Employee</h5>
        //                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        //                     <span aria-hidden="true">&times;</span>
        //                 </button>
        //             </div>
        //             <form name="empForm" action="/get" target="hidden-form" onsubmit="return validateForm()">
        //                 Name: <input type="text" name="inputString"></input>
        //                 Age: <input type="number " name="inputAge"></input>
        //                 PPSN: <input type="number " name="inputInt" maxlength = "8"></input>
        //                 Hourly Wage: <input type="number " name="inputFloat"></input>
        //                 <input style="display:none;" class="empId" type="hidden" id="empId" name="line" value=""></input>
        //                 <input type="submit" value="Submit"></input>
        //             </form>
        //         </div>
        //     </div>
        // </div>
        <div>
            <div className='modal'>
                <h3> New Employee </h3>
                <form className='form' onSubmit={submitHandler}>
                    <div className='control'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' required id='name' ref={nameInputRef} />
                    </div>
                    <div className='control'>
                        <label htmlFor='age'>Age</label>
                        <input type='number' required id='age' ref={ageInputRef} />
                    </div>
                    <div className='control'>
                        <label htmlFor='role'>Role</label>
                        <input type='text' required id='role' ref={roleInputRef} />
                    </div>
                    <div className='control'>
                        <label htmlFor='ppsn'>PPSN</label>
                        <input type='text' required id='ppsn' maxlength = "8" ref={ppsnInputRef} />
                    </div>
                    <div className='control'>
                        <label htmlFor='wage'>Hourly Wage</label>
                        <input type='number' required id='wage' step=".01" ref={wageInputRef} />
                    </div>
                    <div>
                        <button className='btn'>Add Employee</button>
                        <button className='btn' onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
                
            </div>
        </div>
    );
}
export default NewEmployeeModal;