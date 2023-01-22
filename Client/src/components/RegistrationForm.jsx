import { useState } from "react";

import {Input, Button, Colors, MessageBox} from '../ui/ui';

export default function RegistrationForm(){
    // Form Handling
    const [registrationFormData, setRegistrationFormData] = useState({
        email: '', 
        registrationNumber: '', 
        password: '', 
        confirmPassword: ''
    })

    //Show Message/Alert Box
    const [showMessageBox, setMessageBox] = useState({
        text: '', 
        display: false
    }); 

    function clearMessageBox(){
        setMessageBox({
            text: '', 
            display: false
        })
    }

    function setFormData(name, value){
        setRegistrationFormData(prevData => {
            return {
                ...prevData, 
                [name]: value
            }
        })
    }

    function checkRegistrationNumber(number){
        const   checkDigits = /^\d{2}\w{3}\d{5}$/, 
                testOne = checkDigits.test(number),
                checkLetters = /[A-Z][A-Z][A-Z]/,
                testTwo = checkLetters.test(number.substring(2, 5));

        if(number.length === 10 && testOne && testTwo){
            return true;
        }

        return false;
    }

    function onSubmitRegistrationForm(){
        console.table(registrationFormData);

        // Registration Form Validation 
        const emailValidation = /@vitbhopal.ac.in$/
        let message = 'Account Successfully created!';

        const   validPassword = registrationFormData.password.length !== 0,
                samePassword = registrationFormData.password === registrationFormData.confirmPassword,
                validEmail = emailValidation.test(registrationFormData.email), 
                validRegistrationNumber = checkRegistrationNumber(registrationFormData.registrationNumber);

        if(!validPassword){
            message = 'Entered Password is Invalid';
        }        
        if(!samePassword){
            message = 'Password do not match';
        }
        if(!validEmail){
            message = 'Entered Email Id is Invalid';
        }
        if(!validRegistrationNumber){
            message = 'Entered Registration Number is incorrect';
        }

        if(message.indexOf('Successfully') !== -1){
           fetch('/register', {
            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(registrationFormData)
           })
           .then(response => response.json())
           .then(response => {
                console.log(response);
           })

        }
        else{
            setMessageBox({
                display: true, 
                text: message
            })
        }

        // Remove Message Box
        setTimeout(()=>{
            clearMessageBox();
        }, 3000);
    }

    const divStyle = {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: '13rem',
    }


    return (
        <div style={divStyle}>
            {showMessageBox.display && <MessageBox>{showMessageBox.text}</MessageBox>}

            <div className="form-wrapper card" style={{paddingBottom: '5rem'}}>
                <Input 
                    labelText='Email' 
                    placeholder='Enter your email address' 
                    type='email' 
                    name='email'
                    value={registrationFormData.email}
                    handleChange={setFormData}
                />        
                <Input 
                    labelText='Registration Number' 
                    placeholder='Enter your registration number' 
                    type='text' 
                    name='registrationNumber'
                    value={registrationFormData.registrationNumber}
                    handleChange={setFormData}
                />        
                <Input 
                    labelText='Create Password'  
                    type='password' 
                    name='password'
                    value={registrationFormData.password}
                    handleChange={setFormData}
                />        
                <Input 
                    labelText='Confirm Password' 
                    type='password' 
                    name='confirmPassword'
                    value={registrationFormData.confirmPassword}
                    handleChange={setFormData}
                />     

                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 1rem', gap: '1rem'}}>
                    <input type='checkbox' style={{display: 'inline-block', marginBottom: '1.3rem'}} /> 
                    <p style={{display: 'inline-block'}}>By creating an Account, I agree to the terms and conditions & privacy policy</p>
                </div>


                <Button 
                    color={Colors.primaryColor} 
                    hoverColor={Colors.primaryColorDark} 
                    onButtonPress={onSubmitRegistrationForm}
                > Register </Button>
            </div>
        </div>
    )
}