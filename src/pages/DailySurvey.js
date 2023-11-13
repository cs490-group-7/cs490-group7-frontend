import React, { useState } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function DailySurvey () {

    const [calories, setCalories] = useState("");
    const [water, setWater] = useState("");
    const [weight, setWeight] = useState("");
    const [mood, setMood] = useState("");
    
    const [caloriesError, setCaloriesError] = useState("");
    const [waterError, setWaterError] = useState("");
    const [weightError, setWeightError] = useState("");
    const [moodError, setMoodError] = useState("");
    
    const navigate = useNavigate();
    const location = useLocation();

    function submit (){
        let valid = true;

         if(calories.length === 0){
            setCaloriesError("Please Enter Calories Burned")
         }
    }
    return (
        <Box sx={{ flexGrow: 1, padding: 2 }} align="left">

        </Box>
    )
}