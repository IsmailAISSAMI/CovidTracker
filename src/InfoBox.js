// rfce es7 command
import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core';


function InfoBox({title, cases, total}) {
    return (
        <Card>
            <CardContent>
                {/* Title ex: coronavirus cases*/}
                <Typography className='infobox-title' color='textSecondary'>
                    {title}
                </Typography>

                {/* +20k of cases */}
                <h2 className='infobox-cases'>{cases}</h2>

                {/* 1.2M in total */}
                <Typography className='infobox-total' color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>
        
        </Card>
    )
}

export default InfoBox
