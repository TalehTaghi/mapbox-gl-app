import axiosPrivate from "../axios/axiosPrivate";

export const createPlot = async (data) => {
    const res = await axiosPrivate.post('/plots', data);

    return res.data.data;
}

export const getPlots = async () => {
    const res = await axiosPrivate.get('/plots');

    return res.data.data;
}