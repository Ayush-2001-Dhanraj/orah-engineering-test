import React, { useEffect } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"

export const ActivityPage: React.FC = () => {
  const [getActivities, activitiesData, loadGetActivities] = useApi({ url: "get-activities" })

  useEffect(() => {
    void getActivities()
  }, [])

  console.log("sdk activitiesData", activitiesData?.activity[activitiesData?.activity.length - 1]?.entity?.student_roll_states)
  return <S.Container>Activity Page</S.Container>
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
}
