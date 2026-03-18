import React, { useState } from 'react'
import Promocode from '../../components/admin/charge/promocode/Promocode';
import ChargeHeader from '../../components/admin/charge/tax/ChargeHeader';
import ChargeManager from '../../components/admin/charge/tax/ChargeManager';
import ConfirmStatusModal from '../../components/admin/common/modal/ConfirmStatusModal';
import { deleteCharge, fetchCharges, updateChargeStatus } from '../../redux/slice/chargesSlice';
import hotToast from '../../util/alert/hot-toast';
import getSweetAlert from '../../util/alert/sweetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCode, fetchCodes, updateCodeStatus } from '../../redux/slice/promocodeSlice';

const Charges = () => {

    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [chargeId, setChargeId] = useState(null);
    const [type, setType] = useState(null);

    const dispatch = useDispatch(),
        { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

    const toggleCharge = (id, updateStatus) => {
        dispatch(updateChargeStatus({ id, updateStatus }))
            .then(res => {
                // console.log(`Response for changing charge status`, res);

                if (res.meta.requestStatus === "fulfilled") {
                    hotToast(`Charge ${updateStatus ? 'activated' : 'blocked'} successfully!`, "success");
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while updating charge status.`, "error");
            })
    };

    const togglePromo = (id, updateStatus) => {
        dispatch(updateCodeStatus({ id, updateStatus }))
            .then(res => {
                // console.log(`Response for changing promocode status`, res);

                if (res.meta.requestStatus === "fulfilled") {
                    hotToast(`Promocode ${updateStatus ? 'activated' : 'blocked'} successfully!`, "success");
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while updating promocode status.`, "error");
            })
    };

    const deleteChargeFn = () => {
        dispatch(type == 'charge' ? deleteCharge(chargeId) : deleteCode(chargeId))
            .then(res => {
                // console.log(`Response for deleting ${type == 'charge'?'charge':'promocode'}`, res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(type == 'charge' ? fetchCharges() : fetchCodes());
                    hotToast(`${type == 'charge' ? 'Charge' : 'Promocode'} deleted successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while deleting ${type == 'charge' ? 'charge' : 'promocode'}.`, "error");
            })
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <ChargeHeader />
                </div>

                <div className="w-full">

                    {/* Main Settings */}
                    <div className="flex w-full justify-between flex-col md:flex-row">
                        {/* Tax & GST */}
                        <ChargeManager toggleCharge={toggleCharge} setOpenMarkModal={setOpenMarkModal} setChargeId={setChargeId} setType={setType} />

                        {/* Promo Codes */}
                        <Promocode togglePromo={togglePromo} setOpenMarkModal={setOpenMarkModal} setChargeId={setChargeId} setType={setType} />
                    </div>
                </div>
            </div>
            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={deleteChargeFn} isLoading={type == 'charge' ? isChargesLoading : null}
                    title={`Delete ${type}`} subTitle={`Are you sure you want to delete the ${type}`} />
            )}
        </>
    )
}

export default Charges