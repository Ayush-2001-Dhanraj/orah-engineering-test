import React, { useState, useEffect } from "react"
import { Box, Grid, Typography } from "@material-ui/core"
import { BorderRadius, FontWeight } from "shared/styles/styles"
import styled from "styled-components"
import { Doughnut } from "react-chartjs-2"
import "chart.js/auto"

interface Props {
  data: any
}

const SpecificRoll: React.FC<Props> = ({ data }) => {
  const [selectedRoll, setSelectedRoll] = useState(Object.keys(data)[0] ? Object.keys(data)[0] : "")
  const [chartData, setChartData] = useState()

  // create chart Details
  useEffect(() => {
    setChartData({
      // @ts-ignore
      labels: ["unmark", "present", "absent", "late"],
      datasets: [
        {
          data: data[selectedRoll],
          backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
          borderWidth: 1,
        },
      ],
    })
  }, [selectedRoll])

  // Check if array of form [0, 0, 0, 0]
  const checknoData = () => {
    let flag = true
    data[selectedRoll].forEach((element: number) => {
      if (element !== 0) flag = false
    })
    return flag
  }

  return (
    <div>
      <Grid container>
        {/* Roll Btns */}
        <S.Grid item md={3} xs={12}>
          {Object.keys(data).length > 0 &&
            Object.keys(data).map((roll) => (
              <Box mb={2} key={roll}>
                <S.Button style={{ backgroundColor: selectedRoll === roll ? "" : "pink" }} onClick={() => setSelectedRoll(roll)}>
                  {roll}
                </S.Button>
              </Box>
            ))}
        </S.Grid>
        {/* Selected Chart or no data state */}
        <S.GridCenter item md={9} xs={12}>
          {chartData && !checknoData() && (
            <Box>
              <Doughnut data={chartData} />
            </Box>
          )}
          {checknoData() && <Typography>No Data Found</Typography>}
        </S.GridCenter>
      </Grid>
    </div>
  )
}

const S = {
  Button: styled.button`
    padding: 10px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    background-color: #343f64;
    border: none;
    color: #fff;
    width: 100%;
    cursor: pointer;
  `,
  Grid: styled(Grid)`
    && {
      max-height: 80vh;
      overflow: scroll;
      @media only screen and (max-width: 600px) {
        max-height: 200px;
      }
    }
  `,
  GridCenter: styled(Grid)`
    && {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
}

export default SpecificRoll
