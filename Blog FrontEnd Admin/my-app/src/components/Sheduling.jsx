import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import "../Css/Sheduling.css";
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Sheduling({setShedulingTab,forSheduling}) {
  const [rightValue, setRightValue] = useState(null);
  const themeColor = "#19CC8B";
  
  const currentTime = dayjs();
  const minTime = currentTime.add(0, 'minute');

  const shouldDisableDate = (date) => date.isBefore(currentTime, 'day');

  const shouldDisableTime = (value, view) => {
    if (value.isSame(currentTime, 'day')) {
      return value.isBefore(minTime);
    }
    return false;
  };

  
 


  function sendingDateTime(){
    if (rightValue) {
        console.log("or bhai")
        const date = rightValue.format('YYYY-MM-DD');
        const time = rightValue.format('HH:mm:ss');
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
        const result = {
          date,
          time,
          timeZone
        };
    
        forSheduling(result); // Send extracted data
        setShedulingTab(false)
      }
  }






  return (
    <div className="BatchSheduling-parent">
      <motion.div initial={{width:"4rem"}} animate={{width:""}} className="BatchSheduling-child right-picker">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select Date & Time (Right)"
            value={rightValue}
            onChange={(newValue) => setRightValue(newValue)}
            disablePast={true}
            shouldDisableDate={shouldDisableDate}
            shouldDisableTime={shouldDisableTime}
            minDateTime={minTime}
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: true,
                className: 'custom-input',
                sx: {
                    color:"white",
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: "rgba(255, 255, 255, 0)",
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: "rgba(255, 255, 255, 0.48)",
                    top:"-8%"
                  }
                }
              },
              popper: {
                placement: 'bottom',
                sx: {
                  '& .MuiPaper-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.4) !important',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    '&::-webkit-scrollbar': {
                      display: 'none'
                    },
                    '& .MuiPickersDay-root.Mui-selected': {
                      backgroundColor: `${themeColor} !important`,
                    },
                    '& .MuiClock-pin, & .MuiClockPointer-root, & .MuiClockPointer-thumb': {
                      backgroundColor: `${themeColor} !important`,
                      borderColor: `${themeColor} !important`,
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: `${themeColor} !important`,
                    },
                    '& .MuiTab-root.Mui-selected': {
                      color: `${themeColor} !important`,
                    },
                    '& .Mui-selected': {
                      backgroundColor: `${themeColor} !important`, // ✅ Fixes AM/PM blue color issue
                    },
                  }
                }
              },
              actionBar: {
                actions: ['cancel', 'accept'],
                sx: {
                  '& .MuiButton-root': {
                    color: `${"black"} !important`,
                  }
                },
                disableCloseOnSelect: true, // ✅ Prevents auto-close after selecting AM/PM
              }
            }}
            sx={{
              '& .MuiPaper-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
              }
            }}
          />
        </LocalizationProvider>
        <div className="SelectDateOption">
        <button onClick={()=>{ forSheduling(undefined); setShedulingTab(false)}} className="sheduleReject">Close</button>
            <button onClick={()=>{sendingDateTime()}} className="sheduleAccept">Shedule</button>
        </div>
      </motion.div>
    </div>
  );
}
