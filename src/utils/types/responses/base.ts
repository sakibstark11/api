export default interface HttpResponse<generic> {
    status: number;
    payload: generic;
}
