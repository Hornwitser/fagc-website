import { Report } from "fagc-api-types"
import React, { useEffect, useState } from "react"
import { Grid, IconButton, Paper, Skeleton } from "@mui/material/"
import { DeleteTwoTone } from "@mui/icons-material"
import { FAGC } from "../../FAGC"
import useFetchReport from "../Hooks/fetchReport"
import { useFetchCommunity } from "../Hooks/fetchCommunity"
import { useFetchRuleId } from "../Hooks/fetchRule"
import { useStyles } from "../../Other/themes/styles"
import { useAppSelector } from "../../redux/store"

interface ReportProps {
	id: string
}

const ReportComponent: React.FC<ReportProps> = ({ id }: ReportProps) => {
	const classes = useStyles()
	const [{ report, loading: reportLoading }, setReport] = useFetchReport()
	const [{ community, loading: communityLoading }, setCommunity] =
		useFetchCommunity()
	const [{ rule, loading: ruleLoading }, setRule] = useFetchRuleId()

	useEffect(() => {
		if (!report) return
		setCommunity(report.communityId)
		setRule(report.brokenRule)
	}, [report])
	useEffect(() => {
		setReport(id)
	}, [id])

	const user = useAppSelector((data) => data.user)

	console.log(user.user?.apiAccess)

	const userHasWriteAccess =
		(user.user &&
			user.user.apiAccess.find(
				(guild) => guild.communityId === report?.communityId
			)) ||
		false

	const skeleton = (width: string) => <Skeleton width={width} />

	return (
		<>
			<p className={classes.p}>Report ID: {id}</p>
			<p className={classes.p}>
				Playername:{" "}
				{reportLoading ? skeleton("6em") : report?.playername}
			</p>
			<p className={classes.p}>
				Broken rule:{" "}
				{ruleLoading
					? skeleton("6em")
					: `${rule?.shortdesc} (${rule?.id})`}
			</p>
			<p className={classes.p}>
				Description:{" "}
				{reportLoading ? skeleton("4em") : report?.description}
			</p>
			<p className={classes.p}>
				Admin ID: {reportLoading ? skeleton("8em") : report?.adminId}
			</p>
			<p className={classes.p}>
				Community:{" "}
				{communityLoading
					? skeleton("6em")
					: `${community?.name} (${community?.id})`}
			</p>
			<p className={classes.p}>
				Proof: {reportLoading ? skeleton("4em") : report?.proof}
			</p>
			<IconButton
				style={{
					float: "right",
				}}
				disabled={!userHasWriteAccess}
			>
				<DeleteTwoTone />
			</IconButton>
		</>
	)
}
export default ReportComponent
