import { Loader2, Plus, BadgePercent } from "lucide-react";
import { useEffect, useState } from "react";
import ChargeModal from "../modal/ChargeModal";
import { useDispatch, useSelector } from "react-redux";
import { addCharge, fetchCharges, updateCharge } from "../../../../redux/slice/chargesSlice";
import hotToast from "../../../../util/alert/hot-toast";
import ChargeRow from "./ChargeRow";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import SectionCard from "../../common/SectionCard";

const ChargeManager = ({ toggleCharge, setOpenMarkModal, setChargeId, setType }) => {

    const [modalOpen, setModalOpen] = useState(false);
    const [editCharge, setEditCharge] = useState(null);

    const dispatch = useDispatch(),
        { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);

    const saveCharge = (charge) => {

        if (editCharge) {
            const existCharge = allCharges?.filter(existch => existch?.charge_type?.toLowerCase() == charge?.charge_type?.toLowerCase());
            const removeCurrent = existCharge?.find(ch => ch?.id != editCharge?.id);

            if (removeCurrent) {
                hotToast('Charge already exist!', "info");
                setModalOpen(false);
            }
            else {
                dispatch(updateCharge({ id: editCharge?.id, updatedData: charge }))
                    .then(res => {
                        // console.log('Response for updating charges', res);

                        if (res.meta.requestStatus === "fulfilled") {
                            setModalOpen(false);
                            setEditCharge(null);
                            dispatch(fetchCharges());
                            hotToast('Charge updated successfully!', "success");
                        }
                    })
                    .catch(err => {
                        console.log('Error occured', err);
                        getSweetAlert("Error", `Something went wrong while updating charge.`, "error");
                    })
            }
        } else {
            const existCharge = allCharges?.find(existch => existch?.charge_type?.toLowerCase() == charge?.charge_type?.toLowerCase());

            if (existCharge) {
                hotToast('Charge already exist!', "info");
                setModalOpen(false);
            }
            else {
                dispatch(addCharge({ ...charge, status: true }))
                    .then(res => {
                        // console.log('Response for adding charges', res);

                        if (res.meta.requestStatus === "fulfilled") {
                            setModalOpen(false);
                            dispatch(fetchCharges());
                            hotToast('Charge added successfully!', "success");
                        }
                    })
                    .catch(err => {
                        console.log('Error occured', err);
                        getSweetAlert("Error", `Something went wrong while adding charge.`, "error");
                    })
            }
        }
    };

    const openEdit = (charge) => {
        setEditCharge(charge);
        setModalOpen(true);
    };

    useEffect(() => {
        dispatch(fetchCharges())
            .then(res => {
                // console.log('Response for fetching all courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    // console.log('All available charges', allCharges);

    return (
        <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-6 h-[480px] w-full overflow-y-auto md:mr-1.5">

            {/* Header */}
            <SectionCard icon={BadgePercent} title="Course Charges"></SectionCard>

            {/* Charges List */}
            <div className="space-y-3 flex flex-col items-center">

                {isChargesLoading ? <Loader2 className="text-center inline w-10 h-10 animate-spin" /> :
                    allCharges?.map(charge => (
                        <ChargeRow key={charge?.id} charge={charge} toggleCharge={toggleCharge} openEdit={openEdit}
                            setOpenMarkModal={setOpenMarkModal} setChargeId={setChargeId} setType={setType} />
                    ))}

                <button
                    onClick={() => setModalOpen(true)}
                    className="text-center w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2 rounded-xl cursor-pointer"
                >
                    <Plus size={16} className="inline mb-1 mr-1" />
                    Add Charge
                </button>
            </div>

            <ChargeModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditCharge(null); }}
                onSave={saveCharge}
                editData={editCharge} isChargesLoading={isChargesLoading}
            />

        </div>
    );
};

export default ChargeManager;