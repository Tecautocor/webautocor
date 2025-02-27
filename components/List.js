import Image from "next/image";
import Link from "next/link";
import { calcCuota48Meses } from "../lib/utils";

export default function List({ list }) {
  return (
    <div className="bg-white py-4">
      <div className="relative overflow-hidden">
        <div className="relative pb-4">
          <div className="relative">
            <div className="mx-auto mt-2 grid max-w-md gap-8 px-6 sm:max-w-lg lg:max-w-7xl lg:grid-cols-4 lg:px-8">
              {list.map((listItem) => (
                <div
                  key={listItem.id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="flex-shrink-0">
                    <Link href={"/vehiculos/" + listItem.id}>
                      {listItem.media.length > 0 ? (
                        <Image
                          className="h-56 w-full object-cover"
                          src={
                            listItem.media.filter(
                              (photo) => photo.size === "desktop"
                            )[0].full_path
                          }
                          alt=""
                          width={1200}
                          height={730}
                          priority
                        />
                      ) : (
                        <Image
                          className="h-56 w-full object-cover"
                          src={"/foto-autocor.jpg"}
                          alt=""
                          width={1200}
                          height={730}
                          priority
                        />
                      )}
                    </Link>
                  </div>



                  <div className="flex flex-1 flex-col justify-between bg-white p-6">

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 uppercase text-center">
                    
                      {listItem.owner_branch_code?.name}
                      
                      </p>
                    </div>

                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-900 uppercase text-center">
                        {listItem.brand + " " + listItem.model}
                      </p>
                    </div>


                    <div className="flex justify-between py-2 items-center mb-2">
                      <div className="text-main text-1xl font-bold flex justify-center mx-2">
                        ${" "}
                        <span className="number-text">
                          {new Intl.NumberFormat("es-EC", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(Number(listItem.prices[0].value | 0))}
                        </span>
                      </div>
                      <div className="text-gray-200">|</div>
                      <div className="text-gray-600 flex justify-center items-baseline font-light mx-2">
                        ${" "}
                        <span className="number-text">
                          {new Intl.NumberFormat("es-EC", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(
                            calcCuota48Meses(Number(listItem.prices[0].value | 0))
                          )}
                        </span>
                        <span className="text-sm ml-1">/mes</span>
                      </div>
                    </div>


                    <hr />

                    <div className="flex flex-wrap gap-2 text-sm xl:text-xs justify-center mx-2 px-2 pt-4 text-gray-400 font-light">
                      <div className="flex items-center text-gray-600 justify-center w-full xl:w-auto xl:flex-1">
                        <IconYear />
                        <p>{listItem.year | 0}</p>
                      </div>
                      <div className="flex items-center text-gray-600 justify-center w-full xl:w-auto xl:flex-1">
                        <IconKm />
                        <p>
                          {new Intl.NumberFormat("es-EC", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(listItem.odometer | 0)}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-600 justify-center w-full xl:w-auto xl:flex-1">
                        <IconEngine />
                        <p>
                          {new Intl.NumberFormat("es-EC", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(listItem.business_channel | 0)}
                        </p>
                      </div>
                      <div className="flex items-center text-gray-600 justify-center w-full">
                        <IconFuel />
                        <p>{ `${(listItem.fuel?.name || '')} - ${(listItem.saving_plan?.saving_plan_order || '')}`.toUpperCase() }</p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 gap-2">
                      <div className="w-full flex items-center justify-center">
                        <Link
                          href={"/vehiculos/" + listItem.id}
                          className="bg-gray-600  hover:bg-white hover:text-gray-600 hover:border-gray-600 border text-center py-2 px-2 text-xs text-white font-semibold rounded-lg uppercase w-full transition-colors"
                        >
                          Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconYear() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 190 167"
      className="w-4 mr-1"
    >
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-2.907C-.285-.933-.873.943-1.937 2.639c-.391.623-.882 1.183-1.34 1.762a.425.425 0 01-.298.136c-5.091.006-10.182.006-15.272.006h-.178c2.092-2.772 2.971-5.919 3.128-9.312H.193C.129-4.137.088-3.518 0-2.907M.174 7.194h-16.053V5.875h.257c4.099 0 8.197-.003 12.296.004.311.001.555-.092.775-.307 1.129-1.1 1.938-2.416 2.599-3.833l.126-.262v5.717zM-15.877-8.76h2.696c0 .199-.002.403 0 .607.006.411.288.708.668.706.38-.001.658-.297.663-.71.003-.199.001-.397.001-.608h3.33v.581c.003.433.272.734.659.737.396.004.67-.299.673-.746v-.568h3.375c0 .222-.004.429.001.635.008.391.3.684.671.679.363-.003.648-.291.658-.671.006-.212.001-.425.001-.648H.167v2.639h-16.044V-8.76zM.691-10.11h-3.172c0-.222.003-.427 0-.632-.007-.408-.295-.705-.675-.699-.372.006-.649.299-.656.696-.003.2 0 .4 0 .617h-3.375v-.583c-.004-.43-.278-.73-.667-.73-.388 0-.662.301-.665.731v.587h-3.33c0-.212.003-.418-.001-.623-.007-.397-.285-.69-.657-.695-.38-.005-.667.292-.673.7-.003.199-.001.398-.001.631h-.242l-3.041.001c-.491 0-.757.263-.757.751-.002 1.42.022 2.841-.008 4.261-.057 2.712-.677 5.283-2.041 7.649-.46.799-1.008 1.531-1.703 2.146-.101.09-.164.221-.245.333v.355c.173.375.466.503.873.495.954-.019 1.909-.006 2.863-.006h.261V7.62c0 .089-.003.178.001.266a.67.67 0 00.656.652c.059.002.118.001.177.001H.681c.596 0 .835-.237.835-.83L1.515-9.293c0-.577-.242-.817-.824-.817"
        transform="translate(-1311.72 -17835.7) scale(8.33333) translate(178.624 2151.72)"
      ></path>
    </svg>
  );
}

function IconKm() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 193 119"
      className="w-4 mr-1"
    >
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0 12.256h-8.241c.216-.749.083-1.427-.426-2.032l2.448-3.674c-.379-.252-.743-.496-1.124-.751l-.148.216c-.757 1.135-1.515 2.27-2.27 3.407-.066.099-.123.165-.264.153-1.413-.111-2.507 1.243-2.093 2.611.006.02.001.044.001.078h-8.226c.004-.957-.045-1.905.122-2.869l1.288.668.627-1.198-1.609-.846a9.831 9.831 0 011.049-2.373l1.63 1.089.754-1.125-1.596-1.071c.61-.774 1.323-1.417 2.142-1.994l1.186 1.639 1.097-.794-1.111-1.541A10.033 10.033 0 01-10.857.776v1.987h1.36V.778c1.3.08 2.504.403 3.689.957L-7 3.387l1.094.796 1.289-1.777c.846.556 1.587 1.21 2.244 1.997l-1.799 1.208.753 1.125 1.832-1.225c.032.038.065.067.087.103.405.661.73 1.358.979 2.093.047.137.02.195-.106.259-.573.292-1.141.596-1.722.901l.629 1.197 1.571-.818c.194 1.005.144 1.999.149 3.01m-10.166.019a.682.682 0 01-.682-.688.676.676 0 011.351.009.683.683 0 01-.669.679M1.085 8.452C-.127 2.625-5.875-1.374-11.772-.5c-2.828.418-5.197 1.694-7.081 3.841-1.676 1.909-2.633 4.143-2.797 6.681-.077 1.18-.034 2.369-.044 3.554 0 .013.014.025.032.054H1.13l.225-.003v-3.423c-.013-.065-.029-.13-.039-.196-.076-.519-.125-1.044-.231-1.556"
        transform="translate(-2172.91 -17861.1) scale(8.33333) translate(282.447 2143.95)"
      ></path>
    </svg>
  );
}

function IconFuel() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 24 24"
      className="w-4 mr-1"
    >
      <path fill="#939393" d="M19.77 7.23 17.56 5.02a.75.75 0 0 0-1.06 0l-.47.47a.75.75 0 0 0 1.06 1.06l.12-.12 1.47 1.47v9.15a.75.75 0 0 1-1.5 0V12a1 1 0 1 0-2 0v5.56a2.5 2.5 0 0 0 5 0v-8a2 2 0 0 0-.59-1.42ZM6.5 2A2.5 2.5 0 0 0 4 4.5V19a2.5 2.5 0 0 0 2.5 2.5h7A2.5 2.5 0 0 0 16 19V4.5A2.5 2.5 0 0 0 13.5 2h-7ZM6 6.75A.75.75 0 0 1 6.75 6h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 6 6.75ZM6.75 10a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5ZM6 13.75A.75.75 0 0 1 6.75 13h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" />
    </svg>
  );
}

function IconTransmission() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 mr-1"
    >
      {/* Vertical Lines */}
      <line x1="6" y1="5" x2="6" y2="19" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="18" y1="5" x2="18" y2="19" />
      {/* Horizontal Lines */}
      <line x1="6" y1="12" x2="12" y2="12" />
      <line x1="12" y1="16" x2="18" y2="16" />
    </svg>
  );
}



function IconEngine() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 279 168"
      className="w-5 mr-1"
    >
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0 1.396a.349.349 0 01-.349-.349V.349a.349.349 0 11.698 0v.698A.349.349 0 010 1.396"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(453.47 2151.49)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0 2.312a.349.349 0 01-.349-.349V.349a.35.35 0 01.698 0v1.614A.349.349 0 010 2.312"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(453.47 2146.65)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0 1.396a.349.349 0 01-.349-.349V.349a.35.35 0 01.698 0v.698A.349.349 0 010 1.396"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(453.47 2142.72)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0 17.466h-19.659a1.845 1.845 0 01-1.843-1.843V1.842c0-1.016.827-1.842 1.843-1.842H0c1.016 0 1.843.826 1.843 1.842a.349.349 0 11-.698 0C1.145 1.211.631.697 0 .697h-19.659c-.632 0-1.145.514-1.145 1.145v13.781c0 .631.513 1.145 1.145 1.145H0c.631 0 1.145-.514 1.145-1.145v-4.318a.349.349 0 11.698 0v4.318A1.845 1.845 0 010 17.466"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(451.976 2141.23)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0 1.916h4.391l.423-1.917H-.424L0 1.916zm4.671.698H-.28a.35.35 0 01-.341-.274l-.578-2.614a.347.347 0 01.341-.424h6.107a.35.35 0 01.341.424L5.012 2.34a.35.35 0 01-.341.274"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(433.127 2139.31)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M428.275 4928.15h2.199v-2.2h-2.199v2.2zm2.548.7h-2.897a.351.351 0 01-.349-.35v-2.9c0-.19.156-.35.349-.35h2.897c.193 0 .349.16.349.35v2.9c0 .19-.156.35-.349.35"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(0 -2782.53)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M426.113 4929.15h1.464v-4.2h-1.464v4.2zm1.813.7h-2.162a.351.351 0 01-.349-.35v-4.9c0-.19.156-.35.349-.35h2.162c.193 0 .349.16.349.35v4.9c0 .19-.156.35-.349.35"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(0 -2782.53)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M453.819 4917.27h2.199v-2.2h-2.199v2.2zm2.548.7h-2.897a.351.351 0 01-.349-.35v-2.9c0-.19.156-.35.349-.35h2.897c.193 0 .349.16.349.35v2.9c0 .19-.156.35-.349.35"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(0 -2760.76)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M456.716 4918.27h1.464v-4.2h-1.464v4.2zm1.813.7h-2.162a.351.351 0 01-.349-.35v-4.9c0-.19.156-.35.349-.35h2.162c.193 0 .349.16.349.35v4.9c0 .19-.156.35-.349.35"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(0 -2760.76)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(433.888 2145.09)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(440.344 2145.09)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(446.799 2145.09)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.017A.51.51 0 000 .001h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.208 1.208 0 01-1.207-.508c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207 0 .665-.542 1.206-1.207 1.206"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(433.888 2148.64)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.017A.51.51 0 000 .001h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.208 1.208 0 01-1.207-.508c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207 0 .665-.542 1.206-1.207 1.206"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(440.344 2148.64)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.017A.51.51 0 000 .001h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.208 1.208 0 01-1.207-.508c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207 0 .665-.542 1.206-1.207 1.206"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(446.799 2148.64)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(433.888 2152.18)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(440.344 2152.18)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(446.799 2152.18)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(433.888 2155.73)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(440.344 2155.73)"
      ></path>
      <path
        fill="#939393"
        fillRule="nonzero"
        d="M0-1.018A.51.51 0 000 0h3.606a.51.51 0 000-1.018H0zM3.606.698H0A1.21 1.21 0 01-1.207-.509c0-.666.542-1.207 1.207-1.207h3.606c.665 0 1.207.541 1.207 1.207A1.21 1.21 0 013.606.698"
        transform="translate(-3545.12 -17821.8) scale(8.33333) translate(446.799 2155.73)"
      ></path>
    </svg>
  );
}
