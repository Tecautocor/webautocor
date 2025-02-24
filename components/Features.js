export default function Features({ info }) {
  return (
    <div className="rounded-lg shadow-xl bg-white py-16 px-12 lg:px-12 mt-12 mx-6">
      <div className="flex  flex-col md:flex-row gap-2 lg:gap-12 justify-center pb-12 -mt-20 text-white font-light">
        <div className="flex justify-center">
          <div className="bg-main px-5 py-3 rounded-lg text-center flex gap-2">
            <StarIconTitle />
            <p>Un solo dueño</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="bg-main px-5 py-3 rounded-lg text-center flex gap-2">
            <MaintenanceIconTitle />
            <p>Mantenimiento en casa</p>
          </div>
        </div>
        {Number(info.odometer) <= 10000 && (
          <div className="flex justify-center">
            <div className="bg-main px-5 py-3 rounded-lg text-center flex gap-2">
              <KmIconTitle />
              <p>Menos kilometraje</p>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8 lg:gap-y-24">
        <div className="flex justify-start gap-4 items-center">
          <KmIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Kilometraje</p>
            <p className="text-gray-600 font-bold text-2xl">
              {new Intl.NumberFormat("es-EC", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(info.odometer) | 0)}{" "}
              Km
            </p>
          </div>
        </div>
        <div className="flex justify-start gap-4 items-center">
          <YearIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Año</p>
            <p className="text-gray-600 font-bold text-2xl">{info.year}</p>
          </div>
        </div>
        <div className="flex justify-start gap-4 items-center">
          <ModelIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Tipo</p>
            <p className="text-gray-600 font-bold text-2xl">
              {info.saving_plan.saving_plan_group}
            </p>
          </div>
        </div>
        <div className="flex justify-start gap-4 items-center">
          <TractionIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Tracción</p>
            <p className="text-gray-600 font-bold text-2xl">
              {info.accesories}
            </p>
          </div>
        </div>

        <div className="flex justify-start gap-4 items-center">
          <CcIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Cilindraje</p>
            <p className="text-gray-600 font-bold text-2xl">
              {new Intl.NumberFormat("es-EC", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(Number(info.business_channel) | 0)}
            </p>
          </div>
        </div>
        <div className="flex justify-start gap-4 items-center">
          <TransmisionIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Transmisión</p>
            <p className="text-gray-600 font-bold text-2xl">
              {info.saving_plan.saving_plan_order}
            </p>
          </div>
        </div>
        <div className="flex justify-start gap-4 items-center">
          <ColorIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Color</p>
            <p className="text-gray-600 font-bold text-2xl">{info.color}</p>
          </div>
        </div>
        <div className="flex justify-start gap-4 items-center">
          <PlateIcon />
          <div className="flex flex-col">
            <p className="text-gray-600 font-light text-sm">Placa</p>
            <p className="text-gray-600 font-bold text-2xl">
              {info.license_plate.length > 0
                ? info.license_plate[0] +
                  "XXXXX" +
                  info.license_plate[info.license_plate.length - 1]
                : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StarIconTitle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 237 225"
      className="w-6"
    >
      <path
        fill="#ffffff"
        fillRule="nonzero"
        d="M0-26.961l3.346 10.298h10.828l-8.76 6.365L8.76 0 0-6.365-8.76 0l3.346-10.298-8.76-6.365h10.828L0-26.961z"
        transform="translate(-2026.91 -5183.39) scale(8.33333) translate(257.403 648.968)"
      ></path>
    </svg>
  );
}

function KmIconTitle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 317 196"
      className="w-6"
    >
      <path
        fill="#ffffff"
        fillRule="nonzero"
        d="M0 20.205h-13.585c.356-1.235.136-2.352-.703-3.351l4.035-6.056-1.853-1.238c-.094.137-.17.245-.243.355-1.248 1.872-2.498 3.743-3.743 5.617-.108.163-.203.272-.436.254-2.328-.183-4.131 2.048-3.449 4.303.01.034.001.073.001.129h-13.562c.007-1.577-.074-3.14.201-4.731l2.124 1.102 1.034-1.974-2.652-1.395c.388-1.373.976-2.651 1.728-3.912l2.688 1.795 1.243-1.854-2.631-1.767c1.006-1.275 2.18-2.336 3.531-3.286l1.956 2.701 1.808-1.309-1.831-2.54A16.544 16.544 0 01-17.9 1.279v3.275h2.243V1.282c2.143.132 4.129.665 6.082 1.578l-1.965 2.723 1.803 1.313 2.125-2.929a16.656 16.656 0 013.7 3.291l-2.965 1.993 1.241 1.853 3.019-2.018c.053.061.107.11.143.17a16.916 16.916 0 011.615 3.449c.077.226.033.322-.175.428-.945.482-1.88.981-2.838 1.485l1.036 1.973 2.59-1.348c.32 1.656.237 3.295.246 4.962m-16.76.031a1.124 1.124 0 01-1.124-1.134 1.115 1.115 0 012.228.015c.001.605-.5 1.113-1.104 1.119m18.548-6.302C-.209 4.328-9.686-2.265-19.408-.826c-4.661.691-8.567 2.795-11.674 6.333-2.763 3.148-4.34 6.83-4.611 11.014-.126 1.947-.054 3.907-.071 5.861 0 .02.023.04.052.088h.423l37.151-.001c.124 0 .248-.003.371-.005v-5.642c-.021-.108-.048-.215-.064-.324-.126-.855-.205-1.72-.381-2.564"
        transform="translate(-6253.72 -5205.9) scale(8.33333) translate(786.216 625.731)"
      ></path>
    </svg>
  );
}

function MaintenanceIconTitle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 113 225"
      className="w-2"
    >
      <path
        fill="#ffffff"
        fillRule="nonzero"
        d="M0-16.943a1.804 1.804 0 011.807-1.791c.993.004 1.793.81 1.789 1.804a1.796 1.796 0 01-1.802 1.792A1.806 1.806 0 010-16.943m4.289-4.942a6.725 6.725 0 00-6.869 5.462c-.383 1.972.045 3.793 1.271 5.39C-.26-9.666 1.103-8.842 2.736-8.511c-.011.07-.018.142-.018.215V3.692a1.38 1.38 0 002.759 0V-8.296c0-.074-.008-.146-.019-.217 3.443-.741 5.619-3.966 5.342-7.192a6.772 6.772 0 00-6.511-6.18"
        transform="translate(-10453.8 -5172.58) scale(8.33333) translate(1257.17 642.6)"
      ></path>
    </svg>
  );
}

function YearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 256 225"
      className="w-10 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-3.924C-.385-1.261-1.178 1.271-2.614 3.56c-.527.84-1.19 1.596-1.808 2.377a.576.576 0 01-.403.183c-6.869.009-13.738.008-20.607.008h-.24c2.823-3.739 4.009-7.986 4.222-12.565H.261C.174-5.584.119-4.749 0-3.924m.235 13.63h-21.661V7.925h.346c5.531 0 11.061-.003 16.592.006.42.001.749-.124 1.046-.413C-1.918 6.033-.827 4.257.065 2.345c.044-.094.09-.188.17-.353v7.714zm-21.659-21.528h3.638c0 .268-.003.544 0 .819.008.554.388.955.901.953.513-.001.888-.402.895-.959.004-.268.001-.535.001-.82h4.494c0 .255-.002.52 0 .784.004.585.367.99.89.995.534.006.903-.404.907-1.007v-.767h4.554c0 .3-.005.579.001.857.012.529.405.923.907.917.489-.005.873-.393.887-.906.008-.287.001-.574.001-.875H.226v3.561h-21.65v-3.552zM.932-13.643h-4.279c0-.301.003-.577-.001-.854-.009-.55-.398-.95-.911-.943-.501.007-.876.403-.885.94-.004.269 0 .538 0 .832h-4.554c0-.256.002-.521 0-.786-.005-.581-.376-.986-.899-.986-.524 0-.894.406-.898.987-.002.258 0 .516 0 .791h-4.494c0-.286.004-.563-.001-.84-.009-.537-.385-.931-.886-.938-.514-.007-.901.394-.909.945-.004.269-.001.538-.001.852h-4.43c-.663.001-1.021.356-1.022 1.013-.002 1.917.03 3.834-.011 5.75-.077 3.661-.913 7.13-2.753 10.323-.621 1.077-1.36 2.065-2.298 2.895-.136.121-.222.298-.33.449v.479c.232.506.627.678 1.177.668 1.288-.026 2.576-.009 3.864-.009h.351v2.356c0 .12-.004.24.001.359a.906.906 0 00.885.879c.08.004.16.001.24.001H.919c.805 0 1.126-.319 1.126-1.12v-22.941c0-.779-.327-1.102-1.113-1.102"
        transform="translate(-10382.4 -4449.42) scale(8.33333) translate(1274.52 549.371)"
      ></path>
    </svg>
  );
}

function KmIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 317 196"
      className="w-12 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 20.205h-13.585c.356-1.235.136-2.352-.703-3.351l4.035-6.056-1.853-1.238c-.094.137-.17.245-.243.355-1.248 1.872-2.498 3.743-3.743 5.617-.108.163-.203.272-.436.254-2.328-.183-4.131 2.048-3.449 4.303.01.034.001.073.001.129h-13.562c.007-1.577-.074-3.14.201-4.731l2.124 1.102 1.034-1.974-2.652-1.395c.388-1.373.976-2.651 1.728-3.912l2.688 1.795 1.243-1.854-2.631-1.767c1.006-1.275 2.18-2.336 3.531-3.286l1.956 2.701 1.808-1.309-1.831-2.54A16.544 16.544 0 01-17.9 1.279v3.275h2.243V1.282c2.143.132 4.129.665 6.082 1.578l-1.965 2.723 1.803 1.313 2.125-2.929a16.656 16.656 0 013.7 3.291l-2.965 1.993 1.241 1.853 3.019-2.018c.053.061.107.11.143.17a16.916 16.916 0 011.615 3.449c.077.226.033.322-.175.428-.945.482-1.88.981-2.838 1.485l1.036 1.973 2.59-1.348c.32 1.656.237 3.295.246 4.962m-16.76.031a1.124 1.124 0 01-1.124-1.134 1.115 1.115 0 012.228.015c.001.605-.5 1.113-1.104 1.119m18.548-6.302C-.209 4.328-9.686-2.265-19.408-.826c-4.661.691-8.567 2.795-11.674 6.333-2.763 3.148-4.34 6.83-4.611 11.014-.126 1.947-.054 3.907-.071 5.861 0 .02.023.04.052.088h.423l37.151-.001c.124 0 .248-.003.371-.005v-5.642c-.021-.108-.048-.215-.064-.324-.126-.855-.205-1.72-.381-2.564"
        transform="translate(-6253.72 -5205.9) scale(8.33333) translate(786.216 625.731)"
      ></path>
    </svg>
  );
}

function ModelIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      clipRule="evenodd"
      viewBox="0 0 444 209"
      className="w-16 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-21.357a3.198 3.198 0 00-3.195 3.195v4.045l-23.452.11a3.208 3.208 0 00-3.187 3.201v7.612A3.198 3.198 0 00-26.64 0h3.239l-.182-1.929a4.052 4.052 0 014.027-4.44 4.052 4.052 0 014.028 4.44L-15.71 0H7.941l-.183-1.929a4.052 4.052 0 014.027-4.44 4.052 4.052 0 014.028 4.44L15.63 0h4.575a3.198 3.198 0 003.194-3.194v-6.989c0-1.537-1.098-3.068-2.555-3.56l-.228-.077-.241-.013-4.659-.252c-.902-.805-3.329-3.432-5.312-5.686l-.051-.058-.056-.053c-.897-.855-2.446-1.475-3.683-1.475H0zm0 1.763h6.614c.787 0 1.896.445 2.466.988 0 0 5.281 6.002 6.026 6.254l5.174.28c.746.252 1.355 1.102 1.355 1.889v6.989c0 .787-.643 1.431-1.43 1.431h-2.637a5.817 5.817 0 00-5.783-6.37 5.818 5.818 0 00-5.811 5.811c0 .189.011.374.029.559h-19.776a5.817 5.817 0 00-5.783-6.37 5.818 5.818 0 00-5.783 6.37h-1.301c-.787 0-1.43-.644-1.43-1.431v-7.612c0-.787.643-1.434 1.43-1.437l23.778-.113a1.442 1.442 0 001.431-1.437v-4.369c0-.788.643-1.432 1.431-1.432"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(274.838 750.58)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-11.448a5.73 5.73 0 00-5.724 5.724c0 .213.014.432.042.673A5.72 5.72 0 000 0a5.72 5.72 0 005.682-5.052c.029-.24.042-.459.042-.672A5.73 5.73 0 000-11.448m0 1.764a3.96 3.96 0 110 7.922 3.96 3.96 0 010-7.922"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(286.623 754.257)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-11.434a5.724 5.724 0 00-5.718 5.717c0 .209.014.429.043.672a5.714 5.714 0 0011.351-.002A5.723 5.723 0 000-11.434m0 1.763a3.953 3.953 0 110 7.907 3.953 3.953 0 010-7.907"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(255.282 754.181)"
      ></path>
      <path
        fill="#E53D30"
        d="M271.39 3772.62H290.584V3774.383H271.39z"
        transform="translate(-2041.7 -6076.86) scale(8.33333) translate(0 -3036.26)"
      ></path>
    </svg>
  );
}

function PlateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeMiterlimit="10"
      clipRule="evenodd"
      viewBox="0 0 885 795"
      className="w-12 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-12.195h-16.426L-18.983-.294h16.426L0-12.195zm15.736 0L13.179-.294h11.999v15.343H9.933L6.688 30.294H-9.049l3.246-15.245h-16.426l-3.246 15.245h-15.638l3.245-15.245h-14.359V-.294h17.605l2.557-11.901h-13.966v-15.344h17.311l3.147-14.95h15.638l-3.147 14.95H3.343l3.148-14.95h15.737l-3.147 14.95h12.294v15.344H15.736z"
        transform="translate(-11609.2 -26386.9) scale(8.33333) translate(1456.63 3220.21)"
      ></path>
    </svg>
  );
}

function TransmisionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeMiterlimit="10"
      clipRule="evenodd"
      viewBox="0 0 683 783"
      className="w-12 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.791c-.981 0-1.781.799-1.781 1.781v3.262c0 .982.8 1.781 1.781 1.781h34.591c.982 0 1.781-.799 1.781-1.781V3.572c0-.982-.799-1.781-1.781-1.781h-3.133a.895.895 0 110-1.79c.982 0 1.781-.799 1.781-1.782v-3.263c0-.981-.799-1.78-1.781-1.78H3.133c-.982 0-1.781.799-1.781 1.78v3.263c0 .983.799 1.782 1.781 1.782a.894.894 0 110 1.79H0zm34.591 8.614H0a3.576 3.576 0 01-3.571-3.571V3.572A3.576 3.576 0 010 .001a3.977 3.977 0 01-.438-1.782v-3.263a3.575 3.575 0 013.571-3.57h28.325a3.575 3.575 0 013.571 3.57v3.263c0 .649-.174 1.257-.476 1.782 2.007 0 3.609 1.602 3.609 3.571v3.262a3.575 3.575 0 01-3.571 3.571z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(632.801 3235.82)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 19.021h-23.729a.895.895 0 110-1.79H0c.982 0 1.781-.799 1.781-1.781v-3.264c0-.981-.799-1.78-1.781-1.78h-9.398a.895.895 0 010-1.791c.982 0 1.781-.798 1.781-1.78V3.572c0-.983-.799-1.781-1.781-1.781h-40.856c-.982 0-1.781.798-1.781 1.781v3.263c0 .982.799 1.78 1.781 1.78a.896.896 0 010 1.791h-9.399c-.981 0-1.78.799-1.78 1.78v3.264c0 .982.799 1.781 1.78 1.781h3.254a.895.895 0 110 1.79h-3.254a3.576 3.576 0 01-3.571-3.571v-3.264a3.576 3.576 0 013.571-3.571h6.304a3.545 3.545 0 01-.476-1.78V3.572A3.576 3.576 0 01-50.254 0h40.856a3.576 3.576 0 013.571 3.572v3.263c0 .648-.173 1.256-.476 1.78H0a3.577 3.577 0 013.572 3.571v3.264A3.576 3.576 0 010 19.021z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(679.923 3244.44)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.79h-1.79a.894.894 0 110-1.79H0a.894.894 0 110 1.79z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(625.313 3261.67)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.79h-3.636a.894.894 0 110-1.79H0a.894.894 0 110 1.79zm10.909 0H7.273a.895.895 0 110-1.79h3.636a.894.894 0 110 1.79z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(636.222 3261.67)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.79h-1.79a.894.894 0 110-1.79H0a.894.894 0 110 1.79z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(656.194 3261.67)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.79h-20.428a.894.894 0 110-1.79H0a.894.894 0 110 1.79z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(650.096 3253.05)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.79h-11.585a.895.895 0 110-1.79H0a.894.894 0 110 1.79z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(664.259 3235.82)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 24.983h-6.557a.893.893 0 01-.886-1.019L-4.212.81A.894.894 0 01-2.884.156a9.474 9.474 0 004.672 1.238c.353 0 .72-.025 1.157-.078a.895.895 0 01.995 1.012l-.62 4.44a.896.896 0 01-1.773-.247l.466-3.34a11.07 11.07 0 01-4.624-.896l-2.917 20.908h4.749l.457-3.275a.895.895 0 111.773.247l-.565 4.047a.894.894 0 01-.886.771z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(651.832 3204.01)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 3.626a.895.895 0 01-.887-1.019L-.64.834a.896.896 0 011.773.248L.886 2.855A.896.896 0 010 3.626"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(652.398 3221.32)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 3.626a.895.895 0 01-.887-1.019L-.64.834a.896.896 0 011.773.248L.886 2.855A.896.896 0 010 3.626z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(652.398 3221.32)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 3.825a.895.895 0 01-.887-1.019l.274-1.97a.896.896 0 011.773.247L.885 3.054A.894.894 0 010 3.825"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(653.195 3215.41)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 3.825a.895.895 0 01-.887-1.019l.274-1.97a.896.896 0 011.773.247L.885 3.054A.894.894 0 010 3.825z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(653.195 3215.41)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 3.627a.897.897 0 01-.887-1.019L-.64.836A.887.887 0 01.371.073c.489.068.83.521.762 1.01L.885 2.856A.894.894 0 010 3.627"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(654.019 3209.7)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 3.627a.897.897 0 01-.887-1.019L-.64.836A.887.887 0 01.371.073c.489.068.83.521.762 1.01L.885 2.856A.894.894 0 010 3.627z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(654.019 3209.7)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 3.641a.895.895 0 01-.895-.895 9.54 9.54 0 00-.14-1.63A.895.895 0 01.729.81c.11.635.166 1.286.166 1.936 0 .494-.4.895-.895.895"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(663.998 3193.18)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 3.641a.895.895 0 01-.895-.895 9.54 9.54 0 00-.14-1.63A.895.895 0 01.729.81c.11.635.166 1.286.166 1.936 0 .494-.4.895-.895.895z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(663.998 3193.18)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 3.701a.891.891 0 01-.706-.344 9.568 9.568 0 00-1.64-1.64.895.895 0 011.103-1.41A11.364 11.364 0 01.705 2.255.895.895 0 010 3.701"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(661.8 3186.73)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 3.701a.891.891 0 01-.706-.344 9.568 9.568 0 00-1.64-1.64.895.895 0 011.103-1.41A11.364 11.364 0 01.705 2.255.895.895 0 010 3.701z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(661.8 3186.73)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 1.943a.898.898 0 01-.154-.013 9.506 9.506 0 00-1.63-.14.894.894 0 110-1.79C-1.133 0-.482.056.152.166A.895.895 0 010 1.943"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(655.405 3184.65)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.943a.898.898 0 01-.154-.013 9.506 9.506 0 00-1.63-.14.894.894 0 110-1.79C-1.133 0-.482.056.152.166A.895.895 0 010 1.943z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(655.405 3184.65)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 22.545c-6.216 0-11.272-5.057-11.272-11.273C-11.272 5.057-6.216 0 0 0a.895.895 0 110 1.79c-5.229 0-9.482 4.254-9.482 9.482 0 5.229 4.253 9.483 9.482 9.483 5.229 0 9.482-4.254 9.482-9.483a.895.895 0 011.791 0c0 6.216-5.057 11.273-11.273 11.273"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(653.62 3184.65)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 22.545c-6.216 0-11.272-5.057-11.272-11.273C-11.272 5.057-6.216 0 0 0a.895.895 0 110 1.79c-5.229 0-9.482 4.254-9.482 9.482 0 5.229 4.253 9.483 9.482 9.483 5.229 0 9.482-4.254 9.482-9.483a.895.895 0 011.791 0c0 6.216-5.057 11.273-11.273 11.273z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(653.62 3184.65)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 7.109a.895.895 0 01-.895-.895A4.429 4.429 0 00-5.319 1.79a.895.895 0 110-1.79A6.22 6.22 0 01.895 6.214c0 .494-.4.895-.895.895"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(658.94 3189.71)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 7.109a.895.895 0 01-.895-.895A4.429 4.429 0 00-5.319 1.79a.895.895 0 110-1.79A6.22 6.22 0 01.895 6.214c0 .494-.4.895-.895.895z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(658.94 3189.71)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1.51"
        d="M0 1.79h-3.948a.895.895 0 110-1.79H0a.894.894 0 110 1.79z"
        transform="translate(-5076.05 -26475.7) scale(8.33333) translate(639.882 3235.82)"
      ></path>
    </svg>
  );
}

function CcIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeMiterlimit="10"
      clipRule="evenodd"
      viewBox="0 0 1214 804"
      className="w-16 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 5.133A1.283 1.283 0 01-1.283 3.85V1.283a1.283 1.283 0 012.566 0V3.85c0 .708-.574 1.283-1.283 1.283"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(292.617 3237.74)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0 5.133A1.283 1.283 0 01-1.283 3.85V1.283a1.283 1.283 0 012.566 0V3.85c0 .708-.574 1.283-1.283 1.283z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(292.617 3237.74)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 8.5a1.283 1.283 0 01-1.283-1.283V1.283a1.283 1.283 0 012.566 0v5.934C1.283 7.925.709 8.5 0 8.5"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(292.617 3219.94)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0 8.5a1.283 1.283 0 01-1.283-1.283V1.283a1.283 1.283 0 012.566 0v5.934C1.283 7.925.709 8.5 0 8.5z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(292.617 3219.94)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 5.133A1.282 1.282 0 01-1.283 3.85V1.283a1.283 1.283 0 012.566 0V3.85c0 .709-.574 1.283-1.283 1.283"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(292.617 3205.51)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0 5.133A1.282 1.282 0 01-1.283 3.85V1.283a1.283 1.283 0 012.566 0V3.85c0 .709-.574 1.283-1.283 1.283z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(292.617 3205.51)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0 64.227h-72.292a6.783 6.783 0 01-6.775-6.776V6.775A6.782 6.782 0 01-72.292 0H0a6.783 6.783 0 016.776 6.775 1.283 1.283 0 11-2.566 0A4.215 4.215 0 000 2.566h-72.292a4.214 4.214 0 00-4.209 4.209v50.676a4.214 4.214 0 004.209 4.21H0a4.215 4.215 0 004.21-4.21V41.574a1.283 1.283 0 012.566 0v15.877A6.784 6.784 0 010 64.227z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(287.124 3200.02)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0 7.047h16.146L17.704.001H-1.558L0 7.047zm17.176 2.566H-1.03a1.283 1.283 0 01-1.253-1.006L-4.41-1.005a1.287 1.287 0 011.254-1.561h22.458a1.286 1.286 0 011.253 1.561l-2.126 9.612a1.283 1.283 0 01-1.253 1.006z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(217.812 3192.97)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M199.969 1134.92h8.088v-8.09h-8.088v8.09zm9.371 2.57h-10.654c-.708 0-1.283-.58-1.283-1.29v-10.65c0-.71.575-1.28 1.283-1.28h10.654c.709 0 1.283.57 1.283 1.28v10.65c0 .71-.574 1.29-1.283 1.29z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(0 2081.24)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M192.018 1138.6h5.385v-15.44h-5.385v15.44zm6.668 2.56h-7.951a1.28 1.28 0 01-1.283-1.28v-18c0-.71.575-1.29 1.283-1.29h7.951c.709 0 1.283.58 1.283 1.29v18c0 .71-.574 1.28-1.283 1.28z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(0 2081.24)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M293.9 1094.9h8.087v-8.09H293.9v8.09zm9.371 2.57h-10.654c-.708 0-1.283-.58-1.283-1.29v-10.65c0-.71.575-1.28 1.283-1.28h10.654c.708 0 1.283.57 1.283 1.28v10.65c0 .71-.575 1.29-1.283 1.29z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(0 2161.29)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M304.554 1098.58h5.384v-15.44h-5.384v15.44zm6.668 2.56h-7.951a1.28 1.28 0 01-1.283-1.28v-18.01c0-.71.574-1.28 1.283-1.28h7.951c.708 0 1.283.57 1.283 1.28v18.01c0 .71-.575 1.28-1.283 1.28z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(0 2161.29)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.742a1.873 1.873 0 00-1.871 1.871c0 1.032.84 1.872 1.871 1.872h13.26c1.031 0 1.871-.84 1.871-1.872s-.84-1.871-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.442 4.442 0 010-6.309h13.26a4.442 4.442 0 014.437 4.438 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(220.61 3214.22)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.742a1.873 1.873 0 00-1.871 1.871c0 1.032.84 1.872 1.871 1.872h13.26a1.873 1.873 0 000-3.743H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.442 4.442 0 010-6.309h13.26a4.442 4.442 0 014.437 4.438 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(244.349 3214.22)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.742a1.873 1.873 0 00-1.871 1.871c0 1.032.84 1.872 1.871 1.872h13.26c1.031 0 1.871-.84 1.871-1.872s-.84-1.871-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.442 4.442 0 010-6.309h13.26a4.442 4.442 0 014.437 4.438 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(268.087 3214.22)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743a1.873 1.873 0 00-1.871 1.871c0 1.032.84 1.871 1.871 1.871h13.26a1.873 1.873 0 001.871-1.871c0-1.032-.84-1.871-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.441 4.441 0 010-6.309h13.26a4.441 4.441 0 014.437 4.437 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(220.61 3227.27)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743a1.873 1.873 0 00-1.871 1.871c0 1.032.84 1.871 1.871 1.871h13.26a1.873 1.873 0 001.871-1.871 1.873 1.873 0 00-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.441 4.441 0 010-6.309h13.26a4.441 4.441 0 014.437 4.437 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(244.349 3227.27)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743a1.873 1.873 0 00-1.871 1.871c0 1.032.84 1.871 1.871 1.871h13.26a1.873 1.873 0 001.871-1.871c0-1.032-.84-1.871-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.441 4.441 0 010-6.309h13.26a4.441 4.441 0 014.437 4.437 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(268.087 3227.27)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743c-1.031 0-1.871.84-1.871 1.871 0 1.032.84 1.871 1.871 1.871h13.26a1.873 1.873 0 001.871-1.871c0-1.031-.84-1.871-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.441 4.441 0 010-6.309h13.26a4.441 4.441 0 014.437 4.437 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(220.61 3240.31)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743c-1.031 0-1.871.84-1.871 1.871 0 1.032.84 1.871 1.871 1.871h13.26a1.873 1.873 0 001.871-1.871 1.873 1.873 0 00-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.441 4.441 0 010-6.309h13.26a4.441 4.441 0 014.437 4.437 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(244.349 3240.31)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743c-1.031 0-1.871.84-1.871 1.871 0 1.032.84 1.871 1.871 1.871h13.26a1.873 1.873 0 001.871-1.871c0-1.031-.84-1.871-1.871-1.871H0zm13.26 6.309H0a4.442 4.442 0 01-4.437-4.438A4.441 4.441 0 010-6.309h13.26a4.441 4.441 0 014.437 4.437 4.442 4.442 0 01-4.437 4.438z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(268.087 3240.31)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743a1.874 1.874 0 00-1.871 1.872C-1.871-.839-1.031 0 0 0h13.26a1.873 1.873 0 001.871-1.871c0-1.033-.84-1.872-1.871-1.872H0zm13.26 6.309H0a4.441 4.441 0 01-4.437-4.437A4.442 4.442 0 010-6.309h13.26a4.442 4.442 0 014.437 4.438 4.441 4.441 0 01-4.437 4.437z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(220.61 3253.36)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743a1.874 1.874 0 00-1.871 1.872C-1.871-.839-1.031 0 0 0h13.26a1.873 1.873 0 000-3.743H0zm13.26 6.309H0a4.441 4.441 0 01-4.437-4.437A4.442 4.442 0 010-6.309h13.26a4.442 4.442 0 014.437 4.438 4.441 4.441 0 01-4.437 4.437z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(244.349 3253.36)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="2.25"
        d="M0-3.743a1.874 1.874 0 00-1.871 1.872C-1.871-.839-1.031 0 0 0h13.26a1.873 1.873 0 001.871-1.871c0-1.033-.84-1.872-1.871-1.872H0zm13.26 6.309H0a4.441 4.441 0 01-4.437-4.437A4.442 4.442 0 010-6.309h13.26a4.442 4.442 0 014.437 4.438 4.441 4.441 0 01-4.437 4.437z"
        transform="translate(-1484.63 -26492.6) scale(8.33333) translate(268.087 3253.36)"
      ></path>
    </svg>
  );
}

function TractionIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeMiterlimit="10"
      clipRule="evenodd"
      viewBox="0 0 795 795"
      className="w-12 mr-2"
    >
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-12.874c-1.76 0-3.52.67-4.859 2.009-2.678 2.679-2.678 7.04 0 9.719a6.879 6.879 0 009.718 0c2.678-2.679 2.678-7.04 0-9.719A6.854 6.854 0 000-12.874M0 2.847A8.83 8.83 0 01-6.263.257c-3.452-3.454-3.452-9.071 0-12.525 3.453-3.452 9.073-3.453 12.525 0 3.452 3.454 3.452 9.071 0 12.525A8.825 8.825 0 010 2.847"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1544.44 2980.95)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-12.874c-1.76 0-3.52.67-4.859 2.009-2.678 2.679-2.678 7.04 0 9.719a6.879 6.879 0 009.718 0c2.678-2.679 2.678-7.04 0-9.719A6.854 6.854 0 000-12.874zM0 2.847A8.83 8.83 0 01-6.263.257c-3.452-3.454-3.452-9.071 0-12.525 3.453-3.452 9.073-3.453 12.525 0 3.452 3.454 3.452 9.071 0 12.525A8.825 8.825 0 010 2.847z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1544.44 2980.95)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-4.183c-.59 0-1.179.224-1.628.673a2.305 2.305 0 000 3.255 2.305 2.305 0 003.255 0 2.303 2.303 0 000-3.255A2.292 2.292 0 000-4.183m0 6.585a4.27 4.27 0 01-3.031-1.254 4.256 4.256 0 01-1.256-3.031 4.26 4.26 0 011.256-3.031 4.292 4.292 0 016.062 0 4.29 4.29 0 010 6.062A4.27 4.27 0 010 2.402"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1544.44 2976.83)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-4.183c-.59 0-1.179.224-1.628.673a2.305 2.305 0 000 3.255 2.305 2.305 0 003.255 0 2.303 2.303 0 000-3.255A2.292 2.292 0 000-4.183zm0 6.585a4.27 4.27 0 01-3.031-1.254 4.256 4.256 0 01-1.256-3.031 4.26 4.26 0 011.256-3.031 4.292 4.292 0 016.062 0 4.29 4.29 0 010 6.062A4.27 4.27 0 010 2.402z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1544.44 2976.83)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-1.349l7.185 2.878L8.641.074 1.455-2.805 0-1.349zm7.424 5.036c-.125 0-.25-.024-.369-.071l-9.19-3.681a.996.996 0 01-.603-.723.99.99 0 01.271-.901L.515-4.672a1 1 0 011.071-.22l9.189 3.683a.99.99 0 01.333 1.623L8.126 3.396a.993.993 0 01-.702.291"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1518.13 2997.57)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-1.349l7.185 2.878L8.641.074 1.455-2.805 0-1.349zm7.424 5.036c-.125 0-.25-.024-.369-.071l-9.19-3.681a.996.996 0 01-.603-.723.99.99 0 01.271-.901L.515-4.672a1 1 0 011.071-.22l9.189 3.683a.99.99 0 01.333 1.623L8.126 3.396a.993.993 0 01-.702.291z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1518.13 2997.57)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-3.165l5.032 5.032 4.184-4.184-7.185-2.879L0-3.165zm5.032 7.428a.99.99 0 01-.702-.291l-6.435-6.435a.992.992 0 010-1.404L1.09-7.063a.996.996 0 011.071-.22l9.19 3.683a.99.99 0 01.602.722.99.99 0 01-.27.901L5.734 3.972a.99.99 0 01-.702.291"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1489.2 3028.32)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-3.165l5.032 5.032 4.184-4.184-7.185-2.879L0-3.165zm5.032 7.428a.99.99 0 01-.702-.291l-6.435-6.435a.992.992 0 010-1.404L1.09-7.063a.996.996 0 011.071-.22l9.19 3.683a.99.99 0 01.602.722.99.99 0 01-.27.901L5.734 3.972a.99.99 0 01-.702.291z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1489.2 3028.32)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-1.349L7.185 1.53 8.64.074 1.455-2.804 0-1.349zm7.424 5.036c-.125 0-.25-.023-.369-.07l-9.19-3.683a.99.99 0 01-.332-1.623L.515-4.671a.998.998 0 011.071-.22l9.189 3.682a.99.99 0 01.333 1.623L8.126 3.397a.992.992 0 01-.702.29"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1511.04 3004.66)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-1.349L7.185 1.53 8.64.074 1.455-2.804 0-1.349zm7.424 5.036c-.125 0-.25-.023-.369-.07l-9.19-3.683a.99.99 0 01-.332-1.623L.515-4.671a.998.998 0 011.071-.22l9.189 3.682a.99.99 0 01.333 1.623L8.126 3.397a.992.992 0 01-.702.29z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1511.04 3004.66)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-1.349L7.185 1.53 8.641.075 1.455-2.804 0-1.349zm7.424 5.036c-.125 0-.25-.023-.369-.07l-9.19-3.683a.99.99 0 01-.332-1.623L.515-4.671a.999.999 0 011.071-.22l9.19 3.683a.99.99 0 01.332 1.623L8.126 3.397a.992.992 0 01-.702.29"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1503.95 3011.75)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-1.349L7.185 1.53 8.641.075 1.455-2.804 0-1.349zm7.424 5.036c-.125 0-.25-.023-.369-.07l-9.19-3.683a.99.99 0 01-.332-1.623L.515-4.671a.999.999 0 011.071-.22l9.19 3.683a.99.99 0 01.332 1.623L8.126 3.397a.992.992 0 01-.702.29z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1503.95 3011.75)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 1.812L7.185 4.69l1.73-1.729A8.794 8.794 0 015.869.975a8.775 8.775 0 01-1.986-3.046L0 1.812zm7.424 5.036c-.125 0-.249-.024-.369-.071l-9.19-3.682a.993.993 0 01-.332-1.623l6.149-6.15a.991.991 0 011.681.537 6.824 6.824 0 001.91 3.712 6.83 6.83 0 003.712 1.91.993.993 0 01.537 1.68L8.126 6.557a.993.993 0 01-.702.291"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1532.31 2980.24)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0 1.812L7.185 4.69l1.73-1.729A8.794 8.794 0 015.869.975a8.775 8.775 0 01-1.986-3.046L0 1.812zm7.424 5.036c-.125 0-.249-.024-.369-.071l-9.19-3.682a.993.993 0 01-.332-1.623l6.149-6.15a.991.991 0 011.681.537 6.824 6.824 0 001.91 3.712 6.83 6.83 0 003.712 1.91.993.993 0 01.537 1.68L8.126 6.557a.993.993 0 01-.702.291z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1532.31 2980.24)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-1.351l7.185 2.879L8.64.073 1.455-2.806 0-1.351zm7.424 5.037c-.125 0-.25-.024-.369-.071l-9.19-3.682a.994.994 0 01-.332-1.624L.515-4.673a1 1 0 011.071-.22l9.189 3.683a.993.993 0 01.332 1.623L8.126 3.395a.993.993 0 01-.702.291"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1525.22 2990.49)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-1.351l7.185 2.879L8.64.073 1.455-2.806 0-1.351zm7.424 5.037c-.125 0-.25-.024-.369-.071l-9.19-3.682a.994.994 0 01-.332-1.624L.515-4.673a1 1 0 011.071-.22l9.189 3.683a.993.993 0 01.332 1.623L8.126 3.395a.993.993 0 01-.702.291z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1525.22 2990.49)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-1.349L7.185 1.53 8.64.074 1.455-2.804 0-1.349zm7.423 5.036a1.01 1.01 0 01-.369-.07L-2.135-.066a.99.99 0 01-.332-1.623L.514-4.671a.997.997 0 011.071-.22l9.19 3.682a.993.993 0 01.332 1.623L8.125 3.397a.988.988 0 01-.702.29"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1496.86 3018.84)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-1.349L7.185 1.53 8.64.074 1.455-2.804 0-1.349zm7.423 5.036a1.01 1.01 0 01-.369-.07L-2.135-.066a.99.99 0 01-.332-1.623L.514-4.671a.997.997 0 011.071-.22l9.19 3.682a.993.993 0 01.332 1.623L8.125 3.397a.988.988 0 01-.702.29z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1496.86 3018.84)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-10.373c-.224 0-.448.045-.659.136a1.665 1.665 0 00-.897.918c-.167.416-.162.872.014 1.284.177.412.503.731.919.897L17.132-.023c.416.168.872.163 1.284-.014.412-.177.731-.502.897-.919a1.667 1.667 0 00-.014-1.284 1.665 1.665 0 00-.919-.896L.625-10.251A1.68 1.68 0 000-10.373M17.757 2.085c-.461 0-.923-.088-1.363-.265L-1.362-5.295a3.641 3.641 0 01-2.005-1.959 3.642 3.642 0 01-.032-2.803 3.641 3.641 0 011.959-2.005 3.65 3.65 0 012.803-.033L19.119-4.98a3.648 3.648 0 012.005 1.959c.385.9.396 1.895.032 2.804a3.638 3.638 0 01-1.959 2.005 3.655 3.655 0 01-1.44.297"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1524.21 2991.44)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-10.373c-.224 0-.448.045-.659.136a1.665 1.665 0 00-.897.918c-.167.416-.162.872.014 1.284.177.412.503.731.919.897L17.132-.023c.416.168.872.163 1.284-.014.412-.177.731-.502.897-.919a1.667 1.667 0 00-.014-1.284 1.665 1.665 0 00-.919-.896L.625-10.251A1.68 1.68 0 000-10.373zM17.757 2.085c-.461 0-.923-.088-1.363-.265L-1.362-5.295a3.641 3.641 0 01-2.005-1.959 3.642 3.642 0 01-.032-2.803 3.641 3.641 0 011.959-2.005 3.65 3.65 0 012.803-.033L19.119-4.98a3.648 3.648 0 012.005 1.959c.385.9.396 1.895.032 2.804a3.638 3.638 0 01-1.959 2.005 3.655 3.655 0 01-1.44.297z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1524.21 2991.44)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-10.374a1.67 1.67 0 00-.659.137 1.66 1.66 0 00-.897.918 1.68 1.68 0 00.933 2.182L17.133-.024a1.678 1.678 0 001.248-3.113L.625-10.252A1.68 1.68 0 000-10.374M17.757 2.085c-.461 0-.922-.089-1.363-.266L-1.362-5.295a3.64 3.64 0 01-2.005-1.96 3.642 3.642 0 01-.032-2.803 3.636 3.636 0 011.959-2.004 3.642 3.642 0 012.803-.033l17.756 7.114a3.64 3.64 0 012.005 1.96c.385.9.396 1.895.032 2.803a3.638 3.638 0 01-1.959 2.005 3.656 3.656 0 01-1.44.298"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1517.12 2998.53)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-10.374a1.67 1.67 0 00-.659.137 1.66 1.66 0 00-.897.918 1.68 1.68 0 00.933 2.182L17.133-.024a1.678 1.678 0 001.248-3.113L.625-10.252A1.68 1.68 0 000-10.374zM17.757 2.085c-.461 0-.922-.089-1.363-.266L-1.362-5.295a3.64 3.64 0 01-2.005-1.96 3.642 3.642 0 01-.032-2.803 3.636 3.636 0 011.959-2.004 3.642 3.642 0 012.803-.033l17.756 7.114a3.64 3.64 0 012.005 1.96c.385.9.396 1.895.032 2.803a3.638 3.638 0 01-1.959 2.005 3.656 3.656 0 01-1.44.298z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1517.12 2998.53)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-9.985a1.682 1.682 0 00-1.546 2.337c.177.412.503.731.919.898L17.129.364a1.677 1.677 0 101.248-3.114L.621-9.865A1.68 1.68 0 000-9.985M17.747 2.47c-.453 0-.911-.085-1.356-.262L-1.366-4.908A3.636 3.636 0 01-3.37-6.867a3.637 3.637 0 01-.033-2.803 3.672 3.672 0 014.762-2.038l17.756 7.115A3.667 3.667 0 0121.152.17a3.67 3.67 0 01-3.405 2.3"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1510.03 3005.23)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-9.985a1.682 1.682 0 00-1.546 2.337c.177.412.503.731.919.898L17.129.364a1.677 1.677 0 101.248-3.114L.621-9.865A1.68 1.68 0 000-9.985zM17.747 2.47c-.453 0-.911-.085-1.356-.262L-1.366-4.908A3.636 3.636 0 01-3.37-6.867a3.637 3.637 0 01-.033-2.803 3.672 3.672 0 014.762-2.038l17.756 7.115A3.667 3.667 0 0121.152.17a3.67 3.67 0 01-3.405 2.3z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1510.03 3005.23)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-9.985A1.68 1.68 0 00-.626-6.75L17.13.364c.417.169.872.163 1.284-.014a1.679 1.679 0 00-.036-3.099L.622-9.864A1.666 1.666 0 000-9.985M17.755 2.473c-.461 0-.923-.088-1.364-.265L-1.365-4.907a3.64 3.64 0 01-2.005-1.96 3.642 3.642 0 01-.032-2.803 3.667 3.667 0 014.762-2.037l17.756 7.114a3.643 3.643 0 012.005 1.96c.385.9.396 1.895.032 2.804a3.633 3.633 0 01-1.959 2.004c-.463.198-.95.298-1.439.298"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1502.94 3012.32)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-9.985A1.68 1.68 0 00-.626-6.75L17.13.364c.417.169.872.163 1.284-.014a1.679 1.679 0 00-.036-3.099L.622-9.864A1.666 1.666 0 000-9.985zM17.755 2.473c-.461 0-.923-.088-1.364-.265L-1.365-4.907a3.64 3.64 0 01-2.005-1.96 3.642 3.642 0 01-.032-2.803 3.667 3.667 0 014.762-2.037l17.756 7.114a3.643 3.643 0 012.005 1.96c.385.9.396 1.895.032 2.804a3.633 3.633 0 01-1.959 2.004c-.463.198-.95.298-1.439.298z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1502.94 3012.32)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-10.37c-.666 0-1.297.399-1.56 1.054a1.68 1.68 0 00.933 2.181L17.129-.021c.417.169.873.164 1.284-.014a1.68 1.68 0 00-.036-3.099L.621-10.249A1.657 1.657 0 000-10.37M17.754 2.087c-.461 0-.922-.088-1.363-.264L-1.365-5.292a3.666 3.666 0 01-2.037-4.762 3.643 3.643 0 011.959-2.006 3.637 3.637 0 012.803-.032l17.756 7.115a3.643 3.643 0 012.004 1.959c.385.9.397 1.895.033 2.803a3.638 3.638 0 01-1.959 2.005 3.655 3.655 0 01-1.44.297"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1495.85 3019.79)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-10.37c-.666 0-1.297.399-1.56 1.054a1.68 1.68 0 00.933 2.181L17.129-.021c.417.169.873.164 1.284-.014a1.68 1.68 0 00-.036-3.099L.621-10.249A1.657 1.657 0 000-10.37zM17.754 2.087c-.461 0-.922-.088-1.363-.264L-1.365-5.292a3.666 3.666 0 01-2.037-4.762 3.643 3.643 0 011.959-2.006 3.637 3.637 0 012.803-.032l17.756 7.115a3.643 3.643 0 012.004 1.959c.385.9.397 1.895.033 2.803a3.638 3.638 0 01-1.959 2.005 3.655 3.655 0 01-1.44.297z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1495.85 3019.79)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-10.37a1.68 1.68 0 00-.626 3.235L17.13-.021c.416.168.872.163 1.284-.014a1.68 1.68 0 00-.036-3.099L.622-10.249A1.666 1.666 0 000-10.37M17.754 2.088c-.461 0-.922-.088-1.363-.265L-1.364-5.292a3.64 3.64 0 01-2.005-1.96 3.637 3.637 0 01-.033-2.803 3.635 3.635 0 011.96-2.004 3.621 3.621 0 012.802-.032l17.756 7.113a3.64 3.64 0 012.005 1.96c.385.9.396 1.895.032 2.804a3.633 3.633 0 01-1.959 2.004 3.653 3.653 0 01-1.44.298"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1488.76 3026.88)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-10.37a1.68 1.68 0 00-.626 3.235L17.13-.021c.416.168.872.163 1.284-.014a1.68 1.68 0 00-.036-3.099L.622-10.249A1.666 1.666 0 000-10.37zM17.754 2.088c-.461 0-.922-.088-1.363-.265L-1.364-5.292a3.64 3.64 0 01-2.005-1.96 3.637 3.637 0 01-.033-2.803 3.635 3.635 0 011.96-2.004 3.621 3.621 0 012.802-.032l17.756 7.113a3.64 3.64 0 012.005 1.96c.385.9.396 1.895.032 2.804a3.633 3.633 0 01-1.959 2.004 3.653 3.653 0 01-1.44.298z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1488.76 3026.88)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-2.299l6.778 6.778L11.161.097 4.382-6.681 0-2.299zm6.778 9.174a.989.989 0 01-.702-.29l-8.181-8.182a.992.992 0 010-1.404L3.68-8.787a.994.994 0 011.404 0l8.182 8.182a.994.994 0 010 1.404L7.48 6.585a.989.989 0 01-.702.29"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1482.54 3032.37)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-2.299l6.778 6.778L11.161.097 4.382-6.681 0-2.299zm6.778 9.174a.989.989 0 01-.702-.29l-8.181-8.182a.992.992 0 010-1.404L3.68-8.787a.994.994 0 011.404 0l8.182 8.182a.994.994 0 010 1.404L7.48 6.585a.989.989 0 01-.702.29z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1482.54 3032.37)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 8.431l.326.326.632-.633c.56-.561.869-1.305.869-2.097S1.518 4.491.958 3.93l-.522-.521A10.426 10.426 0 010 8.431m.326 2.722a.992.992 0 01-.702-.291l-1.48-1.48A.992.992 0 01-2.071 8.3 8.443 8.443 0 00-3.903-.931.991.991 0 11-2.5-2.334l4.862 4.861a4.918 4.918 0 011.45 3.5 4.916 4.916 0 01-1.45 3.5l-1.335 1.335a.992.992 0 01-.701.291"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1488.43 3035.79)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0 8.431l.326.326.632-.633c.56-.561.869-1.305.869-2.097S1.518 4.491.958 3.93l-.522-.521A10.426 10.426 0 010 8.431zm.326 2.722a.992.992 0 01-.702-.291l-1.48-1.48A.992.992 0 01-2.071 8.3 8.443 8.443 0 00-3.903-.931.991.991 0 11-2.5-2.334l4.862 4.861a4.918 4.918 0 011.45 3.5 4.916 4.916 0 01-1.45 3.5l-1.335 1.335a.992.992 0 01-.701.291z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1488.43 3035.79)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-.556l.326.326c1.646-.565 3.368-.7 5.022-.437l-.522-.522a2.97 2.97 0 00-4.193 0L0-.556zm10.389 4.52a.99.99 0 01-.702-.291 8.44 8.44 0 00-9.23-1.832.998.998 0 01-1.082-.215l-1.48-1.48a.992.992 0 010-1.404l1.334-1.334a4.959 4.959 0 017 0l4.854 4.853a.995.995 0 01-.694 1.703"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1474.84 3031.19)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-.556l.326.326c1.646-.565 3.368-.7 5.022-.437l-.522-.522a2.97 2.97 0 00-4.193 0L0-.556zm10.389 4.52a.99.99 0 01-.702-.291 8.44 8.44 0 00-9.23-1.832.998.998 0 01-1.082-.215l-1.48-1.48a.992.992 0 010-1.404l1.334-1.334a4.959 4.959 0 017 0l4.854 4.853a.995.995 0 01-.694 1.703z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1474.84 3031.19)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 4.056a.992.992 0 01-.982-1.145 4.107 4.107 0 00-.064-1.589A.993.993 0 01.885.86c.185.775.217 1.567.095 2.356a.994.994 0 01-.98.84"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1483.58 3038.57)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0 4.056a.992.992 0 01-.982-1.145 4.107 4.107 0 00-.064-1.589A.993.993 0 01.885.86c.185.775.217 1.567.095 2.356a.994.994 0 01-.98.84z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1483.58 3038.57)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 2.367a.983.983 0 01-.377-.075 4.093 4.093 0 00-1.56-.307.993.993 0 110-1.985c.8 0 1.58.154 2.315.457A.992.992 0 010 2.367"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1480.48 3034.76)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0 2.367a.983.983 0 01-.377-.075 4.093 4.093 0 00-1.56-.307.993.993 0 110-1.985c.8 0 1.58.154 2.315.457A.992.992 0 010 2.367z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1480.48 3034.76)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0 12.172a6.066 6.066 0 01-4.304-1.78 6.044 6.044 0 01-1.783-4.304c0-1.626.633-3.155 1.783-4.304A6.041 6.041 0 010 0a.993.993 0 110 1.985 4.072 4.072 0 00-2.9 1.202 4.076 4.076 0 00-1.202 2.901 4.08 4.08 0 001.201 2.901 4.108 4.108 0 005.802 0 4.075 4.075 0 001.152-2.268.994.994 0 011.962.304 6.039 6.039 0 01-1.711 3.367A6.065 6.065 0 010 12.172"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1478.54 3034.76)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0 12.172a6.066 6.066 0 01-4.304-1.78 6.044 6.044 0 01-1.783-4.304c0-1.626.633-3.155 1.783-4.304A6.041 6.041 0 010 0a.993.993 0 110 1.985 4.072 4.072 0 00-2.9 1.202 4.076 4.076 0 00-1.202 2.901 4.08 4.08 0 001.201 2.901 4.108 4.108 0 005.802 0 4.075 4.075 0 001.152-2.268.994.994 0 011.962.304 6.039 6.039 0 01-1.711 3.367A6.065 6.065 0 010 12.172z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1478.54 3034.76)"
      ></path>
      <path
        fill="#E53D30"
        fillRule="nonzero"
        d="M0-16.925c-2.261 0-4.387.88-5.986 2.48A8.406 8.406 0 00-8.465-8.46c0 2.262.88 4.387 2.479 5.987 3.301 3.299 8.671 3.299 11.972 0a8.413 8.413 0 002.48-5.987 8.407 8.407 0 00-2.48-5.985A8.407 8.407 0 000-16.925m0 18.91A10.412 10.412 0 01-7.389-1.07a10.379 10.379 0 01-3.062-7.39c0-2.792 1.087-5.415 3.062-7.389A10.378 10.378 0 010-18.91c2.792 0 5.416 1.087 7.39 3.061a10.38 10.38 0 013.061 7.389c0 2.792-1.087 5.416-3.061 7.39A10.416 10.416 0 010 1.985"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1478.54 3049.31)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E53D30"
        strokeWidth="1"
        d="M0-16.925c-2.261 0-4.387.88-5.986 2.48A8.406 8.406 0 00-8.465-8.46c0 2.262.88 4.387 2.479 5.987 3.301 3.299 8.671 3.299 11.972 0a8.413 8.413 0 002.48-5.987 8.407 8.407 0 00-2.48-5.985A8.407 8.407 0 000-16.925zm0 18.91A10.412 10.412 0 01-7.389-1.07a10.379 10.379 0 01-3.062-7.39c0-2.792 1.087-5.415 3.062-7.389A10.378 10.378 0 010-18.91c2.792 0 5.416 1.087 7.39 3.061a10.38 10.38 0 013.061 7.389c0 2.792-1.087 5.416-3.061 7.39A10.416 10.416 0 010 1.985z"
        transform="translate(-12192 -24675.4) scale(8.33333) translate(1478.54 3049.31)"
      ></path>
    </svg>
  );
}

function ColorIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      clipRule="evenodd"
      viewBox="0 0 853 824"
      className="w-12 mr-2"
    >
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-7.444 0H0"
        transform="translate(-8913.63 -26380.8) scale(8.33333) matrix(-1 0 0 1 1092.25 3239.85)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M0 83.145h-3.518a4.495 4.495 0 01-4.495-4.494V4.494A4.495 4.495 0 01-3.518 0h17.977a4.494 4.494 0 014.494 4.494v74.157a4.494 4.494 0 01-4.494 4.494l-5.805-.003"
        transform="translate(-8913.63 -26380.8) scale(8.33333) translate(1090.01 3167.94)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M0 26.966h50.491a4.495 4.495 0 004.495-4.494V4.494A4.495 4.495 0 0050.491 0H43.89"
        transform="translate(-8913.63 -26380.8) scale(8.33333) translate(1114.65 3224.12)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-4.495 4.495h8.99"
        transform="translate(-8913.63 -26380.8) scale(8.33333) matrix(0 -1 -1 0 1160.65 3237.6)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-4.495 4.495h8.99"
        transform="translate(-8913.63 -26380.8) scale(8.33333) matrix(0 -1 -1 0 1149.41 3237.6)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-1.545 1.545h3.09"
        transform="translate(-8913.63 -26380.8) scale(8.33333) matrix(0 -1 -1 0 1135.23 3240.55)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M0 62.975l26.908-46.606a4.495 4.495 0 00-1.645-6.139L9.694 1.241a4.496 4.496 0 00-6.14 1.645L0 9.043"
        transform="translate(-8913.63 -26380.8) scale(8.33333) translate(1115.38 3168.12)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-8.386 2.247H.602"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-29.999 5374.894 3688.108)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-8.386 2.247H.602"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-29.999 5395.861 3682.486)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-3.745 1.004H.269"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-30.002 5421.03 3684.755)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M0 52.762l48.788-28.168a4.493 4.493 0 001.645-6.139L41.445 2.886a4.495 4.495 0 00-6.14-1.645l-6.21 3.585"
        transform="translate(-8913.63 -26380.8) scale(8.33333) translate(1115.38 3188.78)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-6.741 3.892h8.988"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-60.001 2197.35 2598.677)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-6.741 3.892h8.988"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-60.001 2207.073 2593.056)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-2.952 1.704H.984"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-59.995 2220.905 2589.739)"
      ></path>
      <path
        fill="none"
        fillRule="nonzero"
        stroke="#E43D30"
        strokeWidth="4.49"
        d="M-14.63-25.597a13.43 13.43 0 00-6.809 6.808c-3.038 6.799.01 14.773 6.809 17.811C-7.832 2.06.142-.988 3.18-7.786a13.424 13.424 0 00.723-8.959"
        transform="translate(-8913.63 -26380.8) scale(8.33333) scale(-1 1) rotate(-24.08 7100.05 4140.765)"
      ></path>
    </svg>
  );
}
