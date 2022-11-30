import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { NavigationBar } from './components/NavbarTournament';
import { FooterLogin } from './components/FooterLogin';
import Register from "./components/Registration";
import { DropdownChecklist } from './components/DropdownChecklist';
import { DropdownRadio } from './components/DropdownRadio';
import { useNavigate } from 'react-router-dom';

const TeamCreation = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        name: "",
        roster: [],
        captain: null,
    });

    const handleSelectedPlayers = (roster) => {
        setValues({...values, roster: roster});
    }

    const handleSelectCaptain = (captain) => {
        setValues({...values, captain: captain});
    }
    
    const players = [
        { value: "Player 1", label: "Player 1" },
        { value: "Player 2", label: "Player 2" },
        { value: "Player 3", label: "Player 3" },
        { value: "Player 4", label: "Player 4" },
        { value: "Player 5", label: "Player 5" },
        { value: "Player 6", label: "Player 6" },
    ];

    const inputs = [
        {
            id:1,
            name:"name",
            type:"string",
            placeholder:"Enter team name",
            required:true,
        }
    ]

    const handleUp = (e) =>{
        e.preventDefault();
        fetch("http://localhost:9000/team/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: values.name,
                captain: values.captain,
                roster: values.roster.map((player) => (player.label)),
            }),
        })
        .then((res) => res.json())
        .then((values) => console.log("Success: ", values))
        .catch((err) => console.log("Error: ",err))

        navigate("/team");
    }

    const onChange = (e)=>{
        setValues({...values, [e.target.name]: e.target.value});
    }

    return(
        <div className="TeamCreation" id="TeamCreation">
            <styles>
                <Layout>
                    <div>
                        <NavigationBar /> 
                    </div>
                    <container className="Signup">
                        <form className="SignupForm" onSubmit={handleUp}>
                            <h3 id="RegistrationTitle"> Create a team </h3>
                            {inputs.map((input) =>
                                <Register 
                                key={input.id} 
                                {...input} 
                                value={values[input.name]}
                                onChange={onChange}
                                />
                            )}
                            <DropdownChecklist handleChange={handleSelectedPlayers} options={players} selectedOptions={values.roster} placeholder={"Choose players to add..."}/>
                            <DropdownRadio options={players} selectedOption={values.roster} handleChange={handleSelectCaptain} placeholder={"Choose a captain..."}/>
                            <div className="RegistrationTitle">
                                <button type="submit" id="RegistrationButton">Create Team</button>
                            </div>
                        </form>
                </container>
                <FooterLogin />
                </Layout>
            </styles>
        </div>
    )
}

export default TeamCreation;