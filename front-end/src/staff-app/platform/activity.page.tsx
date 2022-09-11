import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Roll } from "shared/models/roll"
import { useApi } from "shared/hooks/use-api"
import { Bar } from "react-chartjs-2"
import "chart.js/auto"
import SpecificRoll from "staff-app/components/specific-roll/Specific-Roll.component"

interface activity {
  type: string
  entity: Roll
  date: string
}

export const ActivityPage: React.FC = () => {
  const [getActivities, activitiesData, loadGetActivities] = useApi<{ activity: activity[] }>({ url: "get-activities" })

  const [chartData, setChartData] = useState()
  const [isGenral, setIsGenral] = useState<boolean>(true)
  const [specificData, setSpecificData] = useState()

  const options = {
    responsive: true,
    legend: {
      display: false,
    },
    type: "bar",
  }

  const growStyle = {
    flexGrow: 1,
    backgroundColor: "#343f64",
    color: "#fff",
    transition: "0.2s",
    textTransform: "uppercase",
  }
  // create Barchart and Specific - Doughnut chart datasets
  const calculateDataSets = () => {
    const unmark: number[] = []
    const present: number[] = []
    const absent: number[] = []
    const late: number[] = []
    const labels: string[] = []
    let specificLabel: any = {}
    activitiesData?.activity?.forEach((a: { entity: Roll }) => {
      let uTemp = 0
      let pTemp = 0
      let aTemp = 0
      let lTemp = 0
      labels.push(a?.entity?.name)
      a?.entity?.student_roll_states?.forEach((roll: { roll_state: string }) => {
        switch (roll.roll_state) {
          case "unmark":
            uTemp++
            break
          case "present":
            pTemp++
            break
          case "absent":
            aTemp++
            break
          case "late":
            lTemp++
            break
          default:
            break
        }
      })
      unmark.push(uTemp)
      present.push(pTemp)
      absent.push(aTemp)
      late.push(lTemp)
      specificLabel = { ...specificLabel, [a?.entity?.name]: [uTemp, pTemp, aTemp, lTemp] }
    })

    setSpecificData(specificLabel)

    setChartData({
      // @ts-ignore
      labels: labels,
      datasets: [
        {
          label: "unmark",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: unmark,
        },
        {
          label: "present",
          backgroundColor: "rgba(155,231,91,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: present,
        },
        {
          label: "absent",
          backgroundColor: "#7cf61933",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: absent,
        },
        {
          label: "late",
          backgroundColor: "#18211133",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: late,
        },
      ],
    })
  }

  useEffect(() => {
    void getActivities()
  }, [])

  useEffect(() => {
    if (loadGetActivities === "loaded") calculateDataSets()
  }, [loadGetActivities])

  return (
    <S.Container>
      {/* Tabs to change the view */}
      <S.ButtonContainer>
        {/* @ts-ignore */}
        <S.Button1 onClick={() => setIsGenral(true)} style={isGenral ? growStyle : {}}>
          General Details
        </S.Button1>
        {/* @ts-ignore */}
        <S.Button2 onClick={() => setIsGenral(false)} style={!isGenral ? growStyle : {}}>
          Specific Details
        </S.Button2>
      </S.ButtonContainer>
      {/* State based component to render */}
      {chartData && isGenral && <Bar data={chartData} options={options} />}
      {!isGenral && <SpecificRoll data={specificData} />}
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 60%;
    margin: ${Spacing.u4} auto 0;
  `,
  ButtonContainer: styled.div`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 8px;
  `,
  Button1: styled.button`
    padding: 10px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    width: 210px;
    border: none;
  `,
  Button2: styled.button`
    padding: 10px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    border: none;
    width: 210px;
  `,
}
