import { Edit, Remove, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { VariantDTO } from "../../../../interfaces/variant/VariantDTO";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../hooks/auth/useAuth";
import { SongDeletingApi, SongsApi } from "../../../../api/generated";
import { useApiState, useApiStateEffect } from "../../../../tech/ApiState";
import { handleApiCall } from "../../../../tech/handleApiCall";
import { SongVariantDto } from "../../../../api/dtos";

interface DeleteButtonProps {
	variant: SongVariantDto;
	reloadSong?: () => void;
}

export default function DeleteButton({
	variant,
	reloadSong
}: DeleteButtonProps) {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = React.useState(false);
	const navigate = useNavigate();

	const { apiConfiguration } = useAuth();
	const songsApi = new SongDeletingApi(apiConfiguration);

	const {
		fetchApiState,
		apiState: { loading: fetching }
	} = useApiState();

	const [dialogOpen, setDialogOpen] = React.useState(false);

	const onClick = async () => {
		if (variant.verified) {
			enqueueSnackbar("Nelze smazat veřejnou píseň.");
			return;
		}

		setDialogOpen(true);
		setLoading(true);
	};

	const indeedDelete = async () => {
		fetchApiState(
			async () => {
				return handleApiCall(
					songsApi.songDeletingControllerDelete(variant.guid)
				);
			},
			(result) => {
				enqueueSnackbar(
					`Píseň ${
						(variant.preferredTitle && " ") || ""
					}byla smazána.`
				);
				reloadSong?.();

				// back in history
				navigate(-1);
				setDialogOpen(false);
			}
		);
	};

	const yesClick = () => {
		indeedDelete();
	};

	const noClick = () => {
		if (fetching) return;
		setLoading(false);
		setDialogOpen(false);
	};

	return (
		<>
			<LoadingButton
				variant="contained"
				color={"error"}
				// startIcon={<Remove/>}
				loading={loading}
				loadingIndicator="Mazání..."
				onClick={async () => {
					onClick();
				}}
				disabled={variant.deleted}>
				{variant.deleted ? "Smazáno" : "Smazat"}
			</LoadingButton>

			<Dialog open={dialogOpen} onClose={noClick}>
				<DialogTitle>Opravdu chcete smazat píseň?</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{fetching
							? "Probíhá odstraňování písně..."
							: "Píseň se smaže natrvalo."}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						variant="outlined"
						onClick={noClick}
						disabled={fetching}>
						Ne
					</Button>
					<LoadingButton
						loading={fetching}
						variant="contained"
						color="error"
						onClick={yesClick}>
						Ano
					</LoadingButton>
				</DialogActions>
			</Dialog>
		</>
	);
}
