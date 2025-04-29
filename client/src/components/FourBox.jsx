import React from 'react'
import { FaBookOpen, FaBriefcase, FaQuestionCircle, FaUsers } from 'react-icons/fa';
const FourBox = () => {
  return (
    <div className='flex justify-center'>
      <div className='grid grid-cols-2 gap-6 mt-[150px]'>
        {/*  first box */}
        <div className='h-[120px] w-[370px] rounded-[12px] border-2 border-b-purple-700 bg-[#8d44e0] shadow-lg hover:scale-105 transform transition-all flex  items-center justify-center gap-4  '>
        
            <FaBookOpen size={40} className="text-black" />
            
             <h1 className='text-black  text-[22px] font-semibold' > Learning</h1>
          
        </div>
            {/*  second box */}

            <div className='h-[120px] w-[370px] rounded-[12px] border-2 border-b-purple-700 bg-[#8d44e0] shadow-lg hover:scale-105 transform transition-all flex  items-center justify-center gap-4  '>
        
                   <FaBriefcase size={40} className="text-black" />
        
                    <h1 className='text-black  text-[22px] font-semibold' > Freelance</h1>
      
           </div>
        
        {/*  third box */}

                <div className='h-[120px] w-[370px] rounded-[12px] border-2 border-b-purple-700 bg-gray-800 shadow-lg hover:scale-105 transform transition-all flex  items-center justify-center gap-4  '>
                
                     <FaQuestionCircle size={40} className="text-white" />

                        <h1 className='text-white  text-[22px] font-semibold' > Take Assessment</h1>

                   </div>
       
        {/*  fourth box */}
        
                 <div className='h-[120px] w-[370px] rounded-[12px] border-2 border-b-purple-700 bg-gray-800 shadow-lg hover:scale-105 transform transition-all flex  items-center justify-center gap-4  '>
                
                     <FaUsers size={40} className="text-white" />

                        <h1 className='text-white  text-[22px] font-semibold' > hire from us</h1>

                   </div>
       
      </div>
    </div>
  )
}

export default FourBox
