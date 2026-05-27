-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 31-12-2024 a las 02:31:38
-- Versión del servidor: 10.11.10-MariaDB
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u425127583_db_autocor`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Vehicle`
--

CREATE TABLE `Vehicle` (
  `id_record` int(11) NOT NULL,
  `id` varchar(191) DEFAULT NULL,
  `media` varchar(191) DEFAULT NULL,
  `brand` varchar(191) DEFAULT NULL,
  `model` varchar(191) DEFAULT NULL,
  `prices` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  `home` int(11) DEFAULT NULL,
  `odometer` int(11) DEFAULT NULL,
  `type` varchar(191) DEFAULT NULL,
  `location` varchar(191) DEFAULT NULL,
  `business_channel` varchar(191) DEFAULT NULL,
  `processedAt` datetime(3) DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Vehicle`
--

INSERT INTO `Vehicle` (`id_record`, `id`, `media`, `brand`, `model`, `prices`, `year`, `owner`, `home`, `odometer`, `type`, `location`, `business_channel`, `processedAt`) VALUES
('1'	'FA08E9C3-D311-462B-93C5-C2E3B6A66AAF'	'https://cdn.pilotsolution.net/crm/stock/autocor/2191/2191_10319_desktop.jpeg'	'DODGE'	'DURANGO'	26900	2013	1	1	97000	'SUV'	'Autocor Shyris'	'5500'	'2023-06-03')	
('2'	'B59A0590-B2EA-4E67-995E-28E759CD6D76'	''	'MAZDA'	'CX9'		2014	1	1	134900	'JEEP'	'Autocor Av. Orellana'	'3.7'	'2023-06-03')	
('3'	'F1CC5B4A-0729-4EA7-9E96-EB40AC109563'	'https://cdn.pilotsolution.net/crm/stock/autocor/3800/3800_113320_desktop.jpeg'	'BMW'	'318I'	28900	2018	1	1	70000	'SEDAN'	'Autocor Shyris'	'1500'	'2023-10-24')	
('4'	'5AEF15FE-2516-4074-8DED-1C6C77433197'	'https://cdn.pilotsolution.net/crm/stock/autocor/4816/4816_122587_desktop.jpeg'	'FORD'	'F150'	13900	1994	1	1	199300	'CAMIONETA'	'Autocor Shyris'	'199300'	'2024-02-13')	
('5'	'7333E76B-54B2-44E5-8E47-AFB2F7FBDE84'	'https://cdn.pilotsolution.net/crm/stock/autocor/4918/4918_101088_desktop.jpeg'	'GREAT WALL'	'HAVAL H6'	17400	2020	1	1	67000	'SUV'	'Autocor El Recreo'	'2000'	'2024-02-23')	
('6'	'B4741B49-6625-46C5-B5EB-AFAEC9FAC873'	'https://cdn.pilotsolution.net/crm/stock/autocor/5028/5028_58072_desktop.jpeg'	'BMW'	'330E'	50900	2022	1	1	22115	'SEDAN'	'Autocor Cumbaya'	'2000'	'2024-03-05')	
('7'	'56BD2AEE-15ED-400C-86AB-9605C5E5D1FB'	'https://cdn.pilotsolution.net/crm/stock/autocor/5053/5053_57828_desktop.jpeg'	'JEEP'	'RENEGADE'	16900	1978	1	1	27000	'JEEP'	'Autocor Shyris'	'2000'	'2024-03-07')	
('8'	'0701628D-9FB9-490C-8939-8FBF82FC0C71'	'https://cdn.pilotsolution.net/crm/stock/autocor/5122/5122_117292_desktop.jpeg'	'CHANGAN'	'CS55'	16600	2023	1	1	37000	'SUV'	'Autocor El Recreo'	'1500'	'2024-03-13')	
('9'	'8D6537F5-4DB6-4F4F-8A96-2C2936A44FB3'	'https://cdn.pilotsolution.net/crm/stock/autocor/5394/5394_117314_desktop.jpeg'	'TOYOTA'	'LAND CRUISER'	13900	2007	1	1	288000	'SUV'	'Autocor El Recreo'	'3400'	'2024-04-06')	
('10'	'9E24A1B7-0C5C-4817-B7B1-44A064A01C01'	'https://cdn.pilotsolution.net/crm/stock/autocor/5415/5415_102456_desktop.jpeg'	'NISSAN'	'KICKS'	17400	2019	1	1	71800	'CROSSOVER'	'Autocor El Recreo'	'1600'	'2024-04-09')	
('11'	'3D158625-9B8D-4FFA-B48E-3003647C52F4'	'https://cdn.pilotsolution.net/crm/stock/autocor/5428/5428_123845_desktop.jpeg'	'CHEVROLET'	'CAPTIVA'	9900	2011	1	1	118000	'SUV'	'Autocor La Prensa'	'3000'	'2024-04-11')	
('12'	'19A4CFD1-DEE1-4F3F-9A57-B17E3AD99B9C'	''	'CHEVROLET'	'SPARK GT'	11600	2020	1	1	85000	'HATCHBACK'	'Autocor Valle de los Chillos'	'1200'	'2024-04-16')	
('13'	'37B44A93-E8C5-4B48-8A2B-CBC3B88DFCF5'	'https://cdn.pilotsolution.net/crm/stock/autocor/5896/5896_111885_desktop.jpeg'	'FORD'	'EXPLORER'	31900	2018	1	1	80000	'SUV'	'Autocor Av. Orellana'	'3500'	'2024-05-22')	
('14'	'78941E41-EEEB-4210-9261-CD7C9C32BEBB'	'https://cdn.pilotsolution.net/crm/stock/autocor/5950/5950_96984_desktop.jpeg'	'CHEVROLET'	'SILVERADO'	16900	2010	1	1	139000	'CAMIONETA'	'Autocor Av. Orellana'	'6000'	'2024-05-29')	
('15'	'BFFD3616-7FCE-4D8D-A569-3811767A749E'	'https://cdn.pilotsolution.net/crm/stock/autocor/6028/6028_124621_desktop.jpeg'	'CHERY'	'TIGGO 7'	18900	2024	1	1	21000	'SUV'	'Autocor Shyris'	'1500'	'2024-06-05')	
('16'	'8C5E1D4B-6E09-4147-9AEE-E3641656E664'	'https://cdn.pilotsolution.net/crm/stock/autocor/6065/6065_76125_desktop.jpeg'	'VOLVO'	'XC40'	32900	2019	1	1	35000	'SUV'	'Autocor Shyris'	'2000'	'2024-06-08')	
('17'	'B990D873-E677-4011-9C9E-57241D8679B1'	'https://cdn.pilotsolution.net/crm/stock/autocor/6203/6203_121384_desktop.jpeg'	'PEUGEOT'	'2008'	24900	2024	1	1	17000	'SUV'	'Autocor La Prensa'	'1200'	'2024-06-20')	
('18'	'D83854B7-6F57-48DC-9DAA-44B3A2337E67'	'https://cdn.pilotsolution.net/crm/stock/autocor/6217/6217_99213_desktop.jpeg'	'MINI'	'COOPER'	31900	2020	1	1	12000	'HATCHBAK'	'Autocor Shyris'	'1500'	'2024-06-21')	
('19'	'3A9E7333-5487-479E-97D0-F2541B6AB465'	'https://cdn.pilotsolution.net/crm/stock/autocor/6287/6287_109756_desktop.jpeg'	'TOYOTA'	'RAV4'	17900	2015	1	1	165000	'SUV'	'Autocor Valle de los Chillos'	'2000'	'2024-06-27')	
('20'	'D6D22B41-4A23-4075-A232-88A401FE57F9'	'https://cdn.pilotsolution.net/crm/stock/autocor/6300/6300_122131_desktop.jpeg'	'RAM'	'2500'	39900	2017	1	1	108000	'CAMIONETA'	'Autocor Av. Orellana'	'2500'	'2024-06-29')	
('21'	'6E451C22-CDB0-45A1-A54F-42E4EDBE7C31'	'https://cdn.pilotsolution.net/crm/stock/autocor/6364/6364_126664_desktop.jpeg'	'FORD'	'BRONCO'	18900	1994	1	1	106000	'SUV'	'Autocor 6 de Diciembre'	'5000'	'2024-07-04')	
('22'	'CDA93A77-8045-4941-9FC1-C55F62D5508A'	'https://cdn.pilotsolution.net/crm/stock/autocor/6385/6385_102358_desktop.jpeg'	'NISSAN'	'XTRAIL'	16900	2017	1	1	122000	'SUV'	'Autocor El Recreo'	'2500'	'2024-07-06')	
('23'	'B38C7A3C-8981-4C43-95B6-874C50C6D12B'	'https://cdn.pilotsolution.net/crm/stock/autocor/6416/6416_113976_desktop.jpeg'	'PEUGEOT'	'2008'	28400	2023	1	1	5000	'SUV'	'Autocor Shyris'	'1200'	'2024-07-10')	
('24'	'1A47CC0F-8886-4914-AFB9-93E4278A9466'	''	'RAM'	'1500'	40900	2019	1	1	80000	'CAMIONETA'	'Autocor Eloy Alfaro'	'3600'	'2024-07-10')	
('25'	'9F5CB129-8539-4E91-9F46-ED73B2A6058F'	''	'FORD'	'ESCAPE'	13900	2015	1	1	138000	'SUV'	'Autocor Valle de los Chillos'	'2500'	'2024-07-13')	
('26'	'A00C9927-1F81-4849-94AC-7F754911DD97'	'https://cdn.pilotsolution.net/crm/stock/autocor/6515/6515_101517_desktop.jpeg'	'TOYOTA'	'4RUNNER'	39900	2014	1	1	240000	'SUV'	'Autocor Shyris'	'4000'	'2024-07-19')	
('27'	'5BF31E42-F825-4626-89AD-4A1C872D5803'	'https://cdn.pilotsolution.net/crm/stock/autocor/6607/6607_124161_desktop.jpeg'	'HYUNDAI'	'IONIQ'	18900	2022	1	1	33000	'SEDAN'	'Autocor La Prensa'	'1600'	'2024-07-26')	
('28'	'285475E9-29EE-4385-B1CB-4BD342C77AA1'	'https://cdn.pilotsolution.net/crm/stock/autocor/6628/6628_89073_desktop.jpeg'	'MINI'	'COOPER'	16900	2003	1	1	80000	'HATCHBACK'	'Autocor Shyris'	'1600'	'2024-07-27')	
('29'	'FA860B8B-E656-4594-A9A5-9966C4124843'	'https://cdn.pilotsolution.net/crm/stock/autocor/6654/6654_113690_desktop.jpeg'	'MITSUBISHI'	'MONTERO'	34900	2019	1	1	132000	'SUV'	'Autocor 6 de Diciembre'	'3000'	'2024-07-30')	
('30'	'D6AF1208-B1EB-48F4-B017-4A34D09E6C4A'	'https://cdn.pilotsolution.net/crm/stock/autocor/6656/6656_118543_desktop.jpeg'	'HYUNDAI'	'TUCSON'	15900	2014	1	1	100000	'SUV'	'Autocor El Recreo'	'2000'	'2024-07-30')	
('31'	'29FB2DFB-37E1-4487-BF8E-1868015E9548'	'https://cdn.pilotsolution.net/crm/stock/autocor/6662/6662_90599_desktop.jpeg'	'NISSAN'	'KICKS'	18900	2021	1	1	77350	'SUV'	'Autocor El Recreo'	'1600'	'2024-07-30')	
('32'	'A676D5D7-1B28-4A14-90B1-EA13856031FE'	'https://cdn.pilotsolution.net/crm/stock/autocor/6729/6729_90650_desktop.jpeg'	'FORD'	'F150'	69900	2018	1	1	77000	''	'Autocor Shyris'	'3500'	'2024-08-04')	
('33'	'F185EEF7-189C-4B8F-8F61-4DB2561C748E'	'https://cdn.pilotsolution.net/crm/stock/autocor/6798/6798_93090_desktop.jpeg'	'LAND ROVER'	'RANGE ROVER'	39900	2012	1	1	129000	'SUV'	'Autocor Shyris'	'5000'	'2024-08-12')	
('34'	'9E14B421-02A9-490B-A239-30A75D7C7755'	'https://cdn.pilotsolution.net/crm/stock/autocor/6832/6832_93623_desktop.jpeg'	'BMW'	'M4 CP'	107900	2016	1	1	20532	'COUPE'	'Autocor Cumbaya'	'3000'	'2024-08-15')	
('35'	'8EE9D37C-3A11-47DE-99E5-B24A7CD05455'	'https://cdn.pilotsolution.net/crm/stock/autocor/6833/6833_124789_desktop.jpeg'	'MERCEDES BENZ'	'C180'	19900	2011	1	1	95000	'SEDAN'	'Autocor 6 de Diciembre'	'1700'	'2024-08-15')	
('36'	'443FA5C6-305A-4D2C-B21A-40A721E1DE14'	'https://cdn.pilotsolution.net/crm/stock/autocor/6863/6863_102306_desktop.jpeg'	'TOYOTA'	'HILUX'	37400	2021	1	1	36000	'CAMIONETA'	'Autocor El Recreo'	'2700'	'2024-08-19')	
('37'	'2C62480C-CF0A-44E7-AB33-3F619AF6EE4F'	'https://cdn.pilotsolution.net/crm/stock/autocor/6898/6898_119713_desktop.jpeg'	'PEUGEOT'	'2008'	20900	2022	1	1	21000	'HATCHBACK'	'Autocor Valle de los Chillos'	'1200'	'2024-08-21')	
('38'	'33DE37E5-7613-4063-A99A-885F3357D728'	'https://cdn.pilotsolution.net/crm/stock/autocor/6984/6984_98000_desktop.jpeg'	'MAZDA'	'CX9'	44600	2022	1	1	41000	'SUV'	'Autocor Shyris'	'2500'	'2024-08-30')	
('39'	'FFCB9B0C-18C7-4DEC-88D0-FCB507035D71'	'https://cdn.pilotsolution.net/crm/stock/autocor/7031/7031_103451_desktop.jpeg'	'NISSAN'	'XTRAIL'	10900	2014	1	1	250000	'SUV'	'Autocor Av. Orellana'	'2500'	'2024-09-03')	
('40'	'4C3D525D-45F1-4DFE-9649-5A95E32B0B62'	'https://cdn.pilotsolution.net/crm/stock/autocor/7045/7045_105769_desktop.jpeg'	'MAZDA'	'BT50'	29900	2020	1	1	110000	'CAMIONETA'	'Autocor Av. Orellana'	'3200'	'2024-09-04')	
('41'	'258EFF56-8D7D-4681-B65D-5B1E527E03DA'	'https://cdn.pilotsolution.net/crm/stock/autocor/7067/7067_113930_desktop.jpeg'	'AUDI'	'A4'	33900	2022	1	1	33000	'SEDAN'	'Autocor Shyris'	'2000'	'2024-09-05')	
('42'	'97394895-405D-4534-B02B-70BDE9A64E07'	'https://cdn.pilotsolution.net/crm/stock/autocor/7101/7101_117525_desktop.jpeg'	'RAM'	'700'	13900	2022	1	1	59000	'CAMIONETA'	'Autocor El Recreo'	'1400'	'2024-09-07')	
('43'	'591F2296-F199-4651-B478-B7F0C082AB5D'	'https://cdn.pilotsolution.net/crm/stock/autocor/7102/7102_106364_desktop.jpeg'	'FORD'	'F150'	33900	2018	1	1	102000	'CAMIONETA'	'Autocor Eloy Alfaro'	'3300'	'2024-09-07')	
('44'	'BF46695D-48D7-4532-B062-1B549889D37F'	'https://cdn.pilotsolution.net/crm/stock/autocor/7191/7191_119751_desktop.jpeg'	'FORD'	'ESCAPE'	13900	2013	1	1	157000	'SUV'	'Autocor Av. Orellana'	'2500'	'2024-09-13')	
('45'	'4BBC67A2-8D15-4BEC-BC52-F9094924807D'	'https://cdn.pilotsolution.net/crm/stock/autocor/7193/7193_121660_desktop.jpeg'	'BMW'	'320I'	38900	2020	1	1	53000	'SEDAN'	'Autocor Cumbaya'	'2000'	'2024-09-13')	
('46'	'BF2F1963-73C9-43EB-AC12-D3F20E7391D9'	'https://cdn.pilotsolution.net/crm/stock/autocor/7195/7195_103466_desktop.jpeg'	'NISSAN'	'XTRAIL'	20900	2018	1	1	78815	'SUV'	'Autocor Av. Orellana'	'2500'	'2024-09-13')	
('47'	'94F80F69-BE95-4577-A03E-D60E11DAC90B'	'https://cdn.pilotsolution.net/crm/stock/autocor/7202/7202_126323_desktop.jpeg'	'TOYOTA'	'HILUX'	36900	2021	1	1	55000	'CAMIONETA'	'Autocor La Prensa'	'2700'	'2024-09-14')	
('48'	'A00FAC41-B6D9-4A85-AD0B-26E7EE15B670'	'https://cdn.pilotsolution.net/crm/stock/autocor/7215/7215_100816_desktop.jpeg'	'TOYOTA'	'FORTUNER'	43400	2022	1	1	73000	'SUV'	'Autocor Shyris'	'2700'	'2024-09-16')	
('49'	'7C51D057-93A3-4EF1-9EF8-666656B9D231'	'https://cdn.pilotsolution.net/crm/stock/autocor/7220/7220_100478_desktop.jpeg'	'VOLKSWAGEN'	'JETTA'	13400	2014	1	1	121000	''	'Autocor Eloy Alfaro'	'Usados'	'2024-09-16')	
('50'	'CBD8DCC8-A6A3-49F6-BE43-365E6349EC01'	'https://cdn.pilotsolution.net/crm/stock/autocor/7228/7228_124814_desktop.jpeg'	'MERCEDES BENZ'	'GLA180'	30900	2019	1	1	81000	'SUV'	'Autocor 6 de Diciembre'	'1600'	'2024-09-17')	
('51'	'BEE0861D-8439-4797-A86B-1AD2EF7B547C'	'https://cdn.pilotsolution.net/crm/stock/autocor/7241/7241_102177_desktop.jpeg'	'GREAT WALL'	'WINGLE'	19900	2023	1	1	24000	'CABINA SIMPLE'	'Autocor El Recreo'	'2400'	'2024-09-18')	
('52'	'FF8B839E-927E-4D6B-BB8A-CCF8433F15CF'	'https://cdn.pilotsolution.net/crm/stock/autocor/7253/7253_109365_desktop.jpeg'	'CHEVROLET'	'AVEO'	11900	2018	1	1	110000	'SEDAN'	'Autocor Av. Orellana'	'1600'	'2024-09-19')	
('53'	'910DF288-8794-4FD8-BA4E-9221096CA08E'	'https://cdn.pilotsolution.net/crm/stock/autocor/7262/7262_101310_desktop.jpeg'	'BMW'	'330I'	41900	2020	1	1	58000	'SEDAN'	'Autocor Cumbaya'	'2000'	'2024-09-19')	
('54'	'88FCB6F8-66B1-415A-990A-55F3EF5ED6CC'	'https://cdn.pilotsolution.net/crm/stock/autocor/7282/7282_101653_desktop.jpeg'	'CHEVROLET'	'SAIL'	14600	2024	1	1	37000	'SEDAN'	'Autocor Valle de los Chillos'	'1500'	'2024-09-21')	
('55'	'59AF11C8-891F-4C84-BCA1-64DDF792024C'	'https://cdn.pilotsolution.net/crm/stock/autocor/7289/7289_125585_desktop.jpeg'	'NISSAN'	'XTRAIL'	17900	2018	1	1	67000	'SUV'	'Autocor 6 de Diciembre'	'2500'	'2024-09-22')	
('56'	'050C0154-984D-474D-B75F-F404BAD96C46'	'https://cdn.pilotsolution.net/crm/stock/autocor/7294/7294_101736_desktop.jpeg'	'MAZDA'	'CX5'	25400	2020	1	1	77000	'SUV'	'Autocor Shyris'	'2000'	'2024-09-23')	
('57'	'FC0276AD-6DC7-4BEF-80CE-7B77C96F8AEA'	'https://cdn.pilotsolution.net/crm/stock/autocor/7319/7319_106646_desktop.jpeg'	'CITROEN'	'C3'	16900	2019	1	1	55000	'HACBACK'	'Autocor Eloy Alfaro'	'1200'	'2024-09-23')	
('58'	'AB569B5D-0249-477C-A8E9-A069C133B492'	'https://cdn.pilotsolution.net/crm/stock/autocor/7325/7325_102911_desktop.jpeg'	'TOYOTA'	'RAIZE'	18900	2023	1	1	26000	'SUV'	'Autocor Cumbaya'	'1200'	'2024-09-24')	
('59'	'6BC4590D-135F-4407-8070-1F28AB91539F'	'https://cdn.pilotsolution.net/crm/stock/autocor/7339/7339_120672_desktop.jpeg'	'AUDI'	'A5'	21900	2008	1	1	96000	'SEDAN'	'Autocor Cumbaya'	'3200'	'2024-09-24')	
('60'	'679FD87F-07EE-4753-905B-724142AFBC92'	'https://cdn.pilotsolution.net/crm/stock/autocor/7346/7346_103395_desktop.jpeg'	'HUANG HAI'	'COTOPAXI'	29990	2024	1	1	34	'CAMIONETA'	'Autocor El Recreo'	'2000'	'2024-09-25')	
('61'	'6C22B723-9723-4774-A3A3-CE06DD3DFCF3'	'https://cdn.pilotsolution.net/crm/stock/autocor/7355/7355_103514_desktop.jpeg'	'FOTON'	'TUNLAND'	25600	2025	1	1	70	'CAMIONETA'	'Autocor El Recreo'	'2000'	'2024-09-25')	
('62'	'40C264DA-5D23-4D07-82C9-261B43C23FF7'	'https://cdn.pilotsolution.net/crm/stock/autocor/7365/7365_122393_desktop.jpeg'	'JETOUR'	'X70'	16400	2023	1	1	27800	'SUV'	'Autocor La Prensa'	'1500'	'2024-09-26')	
('63'	'F0AD37B8-F398-4427-A2ED-5FEF8588D50E'	'https://cdn.pilotsolution.net/crm/stock/autocor/7368/7368_110086_desktop.jpeg'	'DONGFENG'	'H30'	8900	2016	1	1	147000	'SEDAN'	'Autocor El Recreo'	'1600'	'2024-09-26')	
('64'	'49F337F1-0D6C-4AF4-92D3-E7B8BD5C98C9'	'https://cdn.pilotsolution.net/crm/stock/autocor/7369/7369_104992_desktop.jpeg'	'CITROEN'	'C3'	7900	2007	1	1	123300	'HATSHBACK'	'Autocor El Recreo'	'1400'	'2024-09-26')	
('65'	'9B66FE19-4342-4AD5-9C12-2DD07E5D53C4'	'https://cdn.pilotsolution.net/crm/stock/autocor/7404/7404_104753_desktop.jpeg'	'FORD'	'RANGER'	24900	2019	1	1	65800	'CAMIONETA'	'Autocor Eloy Alfaro'	'2200'	'2024-09-28')	
('66'	'1E232AE0-73C8-49AA-A81A-069B38A9CF6C'	'https://cdn.pilotsolution.net/crm/stock/autocor/7421/7421_105161_desktop.jpeg'	'PEUGEOT'	'2008'	29400	2024	1	1	10600	'SUV'	'Autocor Av. Orellana'	'1200'	'2024-09-30')	
('67'	'9D83E0F9-EC1C-4479-94C2-270B0B87A793'	''	'FORD'	'F150'	34900	2015	1	1	125000	'CAMIONETA'	'Autocor Av. Orellana'	'3500'	'2024-09-30')	
('68'	'E1D1702E-35D3-4D51-AC83-2DF85F5893D5'	'https://cdn.pilotsolution.net/crm/stock/autocor/7427/7427_124547_desktop.jpeg'	'NISSAN'	'QASHQAI'	17900	2016	1	1	122000	'SUV'	'Autocor La Prensa'	'2000'	'2024-10-01')	
('69'	'6C5076ED-98BC-484D-B1FD-6671E1ADA312'	'https://cdn.pilotsolution.net/crm/stock/autocor/7450/7450_109971_desktop.jpeg'	'BMW'	'X3'	24900	2013	1	1	97000	'SUV'	'Autocor Shyris'	'2000'	'2024-10-02')	
('70'	'4F5BD22D-0495-41AE-A35A-C9563EFFA64E'	'https://cdn.pilotsolution.net/crm/stock/autocor/7469/7469_122710_desktop.jpeg'	'MITSUBISHI'	'OUTLANDER'	15900	2014	1	1	155000	'SUV'	'Autocor Av. Orellana'	'3000'	'2024-10-03')	
('71'	'04E3D029-1627-4328-A311-5866BC456DE7'	'https://cdn.pilotsolution.net/crm/stock/autocor/7479/7479_106585_desktop.jpeg'	'TOYOTA'	'COROLLA'	31900	2024	1	1	26850	'SUV'	'Autocor Cumbaya'	'1800'	'2024-10-04')	
('72'	'3BD1AB15-9B4F-4921-B065-92E383CC31C5'	'https://cdn.pilotsolution.net/crm/stock/autocor/7480/7480_106475_desktop.jpeg'	'PEUGEOT'	'207'	9600	2012	1	1	95000	'HATCHBACK'	'Autocor Valle de los Chillos'	'1400'	'2024-10-04')	
('73'	'E8ACDBFF-2933-485F-AB72-59CFE049F3F2'	'https://cdn.pilotsolution.net/crm/stock/autocor/7486/7486_108444_desktop.jpeg'	'CHERY'	'ARRIZO 3'	11400	2022	1	1	70000	'SEDAN'	'Autocor Valle de los Chillos'	'1500'	'2024-10-04')	
('74'	'A51DC935-9307-4CC0-A1CD-9DF76E5FC873'	'https://cdn.pilotsolution.net/crm/stock/autocor/7501/7501_118362_desktop.jpeg'	'RAM'	'1500'	57900	2023	1	1	5318	'CAMIONETA'	'Autocor Valle de los Chillos'	'1500'	'2024-10-06')	
('75'	'A818FED4-842D-452C-B326-97DB38532B5A'	'https://cdn.pilotsolution.net/crm/stock/autocor/7502/7502_107418_desktop.jpeg'	'CHEVROLET'	'DMAX'	22400	2018	1	1	88000	'CAMIONETA'	'Autocor El Recreo'	'2500'	'2024-10-06')	
('76'	'E0C5FAE2-E927-4060-B1CC-6E5F987833AE'	'https://cdn.pilotsolution.net/crm/stock/autocor/7524/7524_107257_desktop.jpeg'	'SUBARU'	'CROSSTREK'	29900	2024	1	1	30000	'SUV'	'Autocor Shyris'	'2000'	'2024-10-08')	
('77'	'5670812D-51F0-4496-9186-7175BDD580A4'	'https://cdn.pilotsolution.net/crm/stock/autocor/7527/7527_112645_desktop.jpeg'	'CHEVROLET'	'DMAX'	10900	2003	1	1	297000	'CAMIONETA'	'Autocor Valle de los Chillos'	'3200'	'2024-10-08')	
('78'	'65E79B3F-FC95-4179-93EB-F09BA290BA29'	'https://cdn.pilotsolution.net/crm/stock/autocor/7540/7540_110436_desktop.jpeg'	'SUZUKI'	'GRAND VITARA'	18600	2022	1	1	86600	'SUV'	'Autocor Av. Orellana'	'1600'	'2024-10-09')	
('79'	'6B8F4088-80E9-4889-A325-FB336C378299'	'https://cdn.pilotsolution.net/crm/stock/autocor/7547/7547_112365_desktop.jpeg'	'FORD'	'ESCAPE'	13900	2015	1	1	143000	'SUV'	'Autocor Av. Orellana'	'2500'	'2024-10-09')	
('80'	'A265CB1C-F201-48C5-B89D-1F8297935BEB'	'https://cdn.pilotsolution.net/crm/stock/autocor/7556/7556_115648_desktop.jpeg'	'HYUNDAI'	'I10'	8900	2011	1	1	157000	'HATCHBACK'	'Autocor Valle de los Chillos'	'1100'	'2024-10-10')	
('81'	'D73FDC8A-3934-48A5-B72D-2770021CB8E3'	'https://cdn.pilotsolution.net/crm/stock/autocor/7581/7581_115353_desktop.jpeg'	'CHERY'	'Q22L'	7900	2013	1	1	70000	'FURGONETA'	'Autocor El Recreo'	'1200'	'2024-10-13')	
('82'	'F7A30EC2-DD9A-4EFB-BE14-88BD9ABA09F8'	'https://cdn.pilotsolution.net/crm/stock/autocor/7606/7606_109102_desktop.jpeg'	'BMW'	'320I'	43900	2022	1	1	27500	'SEDAN'	'Autocor Cumbaya'	'2000'	'2024-10-15')	
('83'	'A0C6C43D-0D6D-4DA8-A6CF-B820758F8E02'	'https://cdn.pilotsolution.net/crm/stock/autocor/7614/7614_108760_desktop.jpeg'	'TOYOTA'	'RAIZE'	19400	2023	1	1	26000	'SUV'	'Autocor Eloy Alfaro'	'1200'	'2024-10-16')	
('84'	'BF361C0A-E59E-4993-86F7-A0355D17F51D'	'https://cdn.pilotsolution.net/crm/stock/autocor/7622/7622_108801_desktop.jpeg'	'TOYOTA'	'FORTUNER'	32900	2017	1	1	85000	'SUV'	'Autocor Valle de los Chillos'	'2700'	'2024-10-16')	
('85'	'B4D0B7D9-7884-459C-84A3-B72E8D5EB933'	'https://cdn.pilotsolution.net/crm/stock/autocor/7637/7637_127263_desktop.jpeg'	'CHANGAN'	'CS15'	13900	2023	1	1	35000	'SUV'	'Autocor 6 de Diciembre'	'1500'	'2024-10-18')	
('86'	'89DAD01E-CA09-4D39-8E96-5669608D7253'	'https://cdn.pilotsolution.net/crm/stock/autocor/7641/7641_109536_desktop.jpeg'	'CHERY'	'TIGGO 4'	18900	2024	1	1	1481	'SUV'	'Autocor Shyris'	'1500'	'2024-10-18')	
('87'	'9A421669-09BC-4005-B579-82D48C473677'	'https://cdn.pilotsolution.net/crm/stock/autocor/7652/7652_109944_desktop.jpeg'	'FORD'	'ESCAPE'	11600	2013	1	1	165000	'SUV'	'Autocor Shyris'	'2500'	'2024-10-18')	
('88'	'3C8395B0-D88E-4512-8A6A-AC6B4519FD59'	'https://cdn.pilotsolution.net/crm/stock/autocor/7653/7653_109841_desktop.jpeg'	'ZX AUTO'	'TERRALORD'	19900	2024	1	1	33000	'CAMIONETA'	'Autocor El Recreo'	'2500'	'2024-10-18')	
('89'	'7862796B-B1A8-4109-9739-8795C281F08E'	'https://cdn.pilotsolution.net/crm/stock/autocor/7655/7655_111692_desktop.jpeg'	'MERCEDES BENZ'	'CLA 200'	31900	2017	1	1	55000	'SEDAN'	'Autocor Shyris'	'1600'	'2024-10-19')	
('90'	'79185DB3-7DB0-4ED6-91A8-BA4AF4ED4F48'	'https://cdn.pilotsolution.net/crm/stock/autocor/7672/7672_113243_desktop.jpeg'	'FODAY'	'NHQ'	12400	2019	1	1	110000	'CAMIONETA'	'Autocor El Recreo'	'2400'	'2024-10-21')	
('91'	'5E6DDACB-E1C8-497B-81C2-75A8625C0911'	'https://cdn.pilotsolution.net/crm/stock/autocor/7676/7676_117690_desktop.jpeg'	'FORD'	'EXPLORER'	31900	2017	1	1	90000	'JEEP'	'Autocor Av. Orellana'	'3500'	'2024-10-21')	
('92'	'13C9E765-CE4B-4D8C-9075-2F67B5784447'	'https://cdn.pilotsolution.net/crm/stock/autocor/7694/7694_119051_desktop.jpeg'	'VOLKSWAGEN'	'TIGUAN'	20400	2018	1	1	109000	'SUV'	'Autocor La Prensa'	'2000'	'2024-10-23')	
('93'	'FAEA0C33-1B28-43BD-AF41-C017D13DED0B'	'https://cdn.pilotsolution.net/crm/stock/autocor/7724/7724_127043_desktop.jpeg'	'VOLKSWAGEN'	'AMAROK'	35900	2018	1	1	50000	'CAMIONETA'	'Autocor Valle de los Chillos'	'2000'	'2024-10-25')	
('94'	'7F9BB2F0-CC80-4F52-82D8-C61273058CB9'	'https://cdn.pilotsolution.net/crm/stock/autocor/7727/7727_121090_desktop.jpeg'	'TOYOTA'	'CHR'	28900	2023	1	1	33000	'SUV'	'Autocor 6 de Diciembre'	'1800'	'2024-10-26')	
('95'	'30143BF9-9AF2-41AB-BA70-1A5781DCACB4'	'https://cdn.pilotsolution.net/crm/stock/autocor/7747/7747_112749_desktop.jpeg'	'CITROEN'	'C3'	17900	2024	1	1	7800	'SUV'	'Autocor Shyris'	'1200'	'2024-10-28')	
('96'	'ABAAB9E8-F1AD-496F-BCEB-D5165E0008AB'	'https://cdn.pilotsolution.net/crm/stock/autocor/7749/7749_112792_desktop.jpeg'	'JEEP'	'GRAND CHEROKEE'	39900	2019	1	1	57000	'SUV'	'Autocor Eloy Alfaro'	'3600'	'2024-10-29')	
('97'	'B62A901D-B445-469E-ACDF-2429DA24A4BE'	'https://cdn.pilotsolution.net/crm/stock/autocor/7760/7760_112995_desktop.jpeg'	'PEUGEOT'	'EXPERT'	25900	2024	1	1	19000	'FURGONETA'	'Autocor Shyris'	'2000'	'2024-10-29')	
('98'	'05A701C2-9940-4A9D-A214-8E7D988EB6C4'	'https://cdn.pilotsolution.net/crm/stock/autocor/7767/7767_115559_desktop.jpeg'	'TOYOTA'	'HILUX'	46900	2022	1	1	120000	'CAMIONETA'	'Autocor Av. Orellana'	'2400'	'2024-10-30')	
('99'	'CD616381-D464-4E8B-8D9D-CD6663FE7F55'	'https://cdn.pilotsolution.net/crm/stock/autocor/7773/7773_113397_desktop.jpeg'	'BMW'	'128TI'	49900	2023	1	1	10206	'SUV'	'Autocor Shyris'	'2000'	'2024-10-31')	
('100'	'F0BDE2B2-293D-4D66-BEDD-A0738A92E650'	'https://cdn.pilotsolution.net/crm/stock/autocor/7784/7784_116448_desktop.jpeg'	'FOTON'	'TUNLAND'	20900	2023	1	1	92000	'CAMIONETA'	'Autocor Av. Orellana'	'2000'	'2024-11-01')	
('101'	'B547D77C-34EC-4E8A-9FD4-5FE3379E680A'	'https://cdn.pilotsolution.net/crm/stock/autocor/7788/7788_114029_desktop.jpeg'	'KIA'	'SPORTAGE'	13900	2015	1	1	167000	'SUV'	'Autocor Av. Orellana'	'2000'	'2024-11-02')	
('102'	'FC35C28C-C308-4206-9CAA-5C56B74DCAD2'	'https://cdn.pilotsolution.net/crm/stock/autocor/7793/7793_119470_desktop.jpeg'	'KIA'	'OPTIMA'	15900	2017	1	1	112000	'SEDAN'	'Autocor Av. Orellana'	'2000'	'2024-11-02')	
('103'	'F4CEA9EB-6A18-4DA6-BBEB-BDDFD45C317C'	'https://cdn.pilotsolution.net/crm/stock/autocor/7803/7803_115510_desktop.jpeg'	'NISSAN'	'XTRAIL'	12900	2013	1	1	145000	'SUV'	'Autocor Av. Orellana'	'2500'	'2024-11-05')	
('104'	'35FEF6DC-BE54-4264-98D6-2D22D016B467'	'https://cdn.pilotsolution.net/crm/stock/autocor/7826/7826_117960_desktop.jpeg'	'KIA'	'SOUL'	12900	2016	1	1	1400	'CROSSOVER'	'Autocor 6 de Diciembre'	''	'2024-11-07')	
('105'	'C9623F0A-98A5-4579-AAEF-051EE3572FED'	'https://cdn.pilotsolution.net/crm/stock/autocor/7828/7828_122303_desktop.jpeg'	'BMW'	'3351'	35900	2011	1	1	65000	'SEDAN'	'Autocor Shyris'	'3000'	'2024-11-07')	
('106'	'2906C22A-A2E1-429B-805F-929ACA093C14'	'https://cdn.pilotsolution.net/crm/stock/autocor/7837/7837_115877_desktop.jpeg'	'FORD'	'F150'	39900	2020	1	1	125000	'CAMIONETA'	'Autocor Eloy Alfaro'	'3300'	'2024-11-08')	
('107'	'C61ECDC0-83C2-4D2A-97C5-524FA8068311'	'https://cdn.pilotsolution.net/crm/stock/autocor/7838/7838_116859_desktop.jpeg'	'MAZDA'	'CX3'	19400	2021	1	1	56000	''	'Autocor Eloy Alfaro'	'Usados'	'2024-11-08')	
('108'	'E7066B52-904C-4ED6-B562-370652151B1D'	'https://cdn.pilotsolution.net/crm/stock/autocor/7839/7839_119174_desktop.jpeg'	'MAZDA'	'MAZDA 2'	15900	2020	1	1	43129	'SEDAN'	'Autocor Cumbaya'	'1500'	'2024-11-08')	
('109'	'20EF5598-FFBF-4982-B7A1-2D0A1C6A3B04'	''	'JEEP'	'COMPASS'	18900	2017	1	1	19000	'JEEP'	'Autocor 6 de Diciembre'	'2400'	'2024-11-08')	
('110'	'CB7ECEA6-5BCB-43A7-A242-A3CFA849E696'	'https://cdn.pilotsolution.net/crm/stock/autocor/7843/7843_123026_desktop.jpeg'	'MITSUBISHI'	'OUTLANDER'	16900	2015	1	1	123200	''	'Autocor Av. Orellana'	'2400'	'2024-11-09')	
('111'	'4AB10619-1562-451B-B21D-D76F436BABE9'	'https://cdn.pilotsolution.net/crm/stock/autocor/7856/7856_121722_desktop.jpeg'	'PORSCHE'	'PANAMERA'	39900	2012	1	1	105000	'SEDAN'	'Autocor Shyris'	'3000'	'2024-11-11')	
('112'	'D975A664-2CB8-4AA4-B4BF-FC409728703F'	'https://cdn.pilotsolution.net/crm/stock/autocor/7877/7877_116670_desktop.jpeg'	'RENAULT'	'STEPWAY'	16900	2024	1	1	17000	''	'Autocor Av. Orellana'	'1600'	'2024-11-12')	
('113'	'B59BA3CE-1C01-417A-8FEA-CAE6C1475D45'	'https://cdn.pilotsolution.net/crm/stock/autocor/7883/7883_121040_desktop.jpeg'	'HYUNDAI'	'TUCSON'	31900	2023	1	1	85	'SUV'	'Autocor La Prensa'	'2000'	'2024-11-12')	
('114'	'E847694C-BD16-493D-8DD8-F2904683082D'	'https://cdn.pilotsolution.net/crm/stock/autocor/7884/7884_121012_desktop.jpeg'	'HYUNDAI'	'TUCSON'	32900	2024	1	1	8	'SUV'	'Autocor 6 de Diciembre'	'2000'	'2024-11-12')	
('115'	'2CDBF8E9-4F75-4D1F-8777-FE41455E2AD5'	'https://cdn.pilotsolution.net/crm/stock/autocor/7893/7893_119161_desktop.jpeg'	'SHINERAY'	'X30'	9900	2022	1	1	110000	''	'Autocor Valle de los Chillos'	'1500'	'2024-11-13')	
('116'	'0684B839-7E7D-4EC5-B660-4CC5BD8188BF'	'https://cdn.pilotsolution.net/crm/stock/autocor/7899/7899_118868_desktop.jpeg'	'TOYOTA'	'YARIS'	19900	2023	1	1	20000	'HACBACK'	'Autocor Valle de los Chillos'	'1500'	'2024-11-14')	
('117'	'87DC1FA6-922D-4E7F-A488-4CEE1A503A0B'	'https://cdn.pilotsolution.net/crm/stock/autocor/7901/7901_118498_desktop.jpeg'	'KIA'	'NIRO'	13900	2017	1	1	102000	'CROSSOVER'	'Autocor 6 de Diciembre'	'1600'	'2024-11-14')	
('118'	'FB4430C2-99D1-485E-BD83-6714E7C090CC'	''	'FORD'	'EXPLORER'	30400	2017	1	1	79000	'SUV'	'Autocor Cumbaya'	'3500'	'2024-11-14')	
('119'	'B1BE009C-D083-4851-AA9B-1D2085EEE636'	'https://cdn.pilotsolution.net/crm/stock/autocor/7912/7912_116915_desktop.jpeg'	'TOYOTA'	'4RUNNER'	38900	2012	1	1	152478	'JEEP'	'Autocor Shyris'	'Usados'	'2024-11-15')	
('120'	'8193D119-0330-4648-890C-6935A9E1067A'	'https://cdn.pilotsolution.net/crm/stock/autocor/7928/7928_117485_desktop.jpeg'	'FORD'	'ECOSPORT'	18600	2020	1	1	41500	'SUV'	'Autocor Shyris'	'2000'	'2024-11-18')	
('121'	'ACC59C8C-EB9B-43F9-AA88-E72D080EE8B1'	'https://cdn.pilotsolution.net/crm/stock/autocor/7934/7934_126848_desktop.jpeg'	'VOLKSWAGEN'	'JETTA'	8400	2009	1	1	190700	'SEDAN'	'Autocor Valle de los Chillos'	'2000'	'2024-11-19')	
('122'	'AF2EC499-E1D0-4E55-A226-C4F94D6FB361'	'https://cdn.pilotsolution.net/crm/stock/autocor/7935/7935_119814_desktop.jpeg'	'CITROEN'	'BERLINGO'	14900	2017	1	1	150900	'FUGONETA'	'Autocor Av. Orellana'	'1600'	'2024-11-19')	
('123'	'576B117E-195F-4C69-ACDE-CFCE780D1B21'	'https://cdn.pilotsolution.net/crm/stock/autocor/7945/7945_123205_desktop.jpeg'	'JEEP'	'NEW'	25400	2019	1	1	58000	'JEEP'	'Autocor Shyris'	'2400'	'2024-11-20')	
('124'	'3CB03F1D-719B-4DF1-BB34-6507CBB2F393'	'https://cdn.pilotsolution.net/crm/stock/autocor/7946/7946_119406_desktop.jpeg'	'FORD'	'BRONCO'	44900	2021	1	1	34000	'JEEP'	'Autocor Eloy Alfaro'	'2000'	'2024-11-20')	
('125'	'5925A1CE-8B0F-4B57-8CE4-481E801B09C5'	'https://cdn.pilotsolution.net/crm/stock/autocor/7955/7955_118941_desktop.jpeg'	'GREAT WALL'	'HAVAL H6'	23400	2023	1	1	42000	'SUV'	'Autocor El Recreo'	'2000'	'2024-11-21')	
('126'	'45C87E31-E035-436D-85D9-90DF07C4B1CC'	'https://cdn.pilotsolution.net/crm/stock/autocor/7956/7956_118966_desktop.jpeg'	'MITSUBISHI'	'MONTERO'	39900	2021	1	1	77000	'SUV'	'Autocor Shyris'	'3000'	'2024-11-21')	
('127'	'14031951-B14A-4827-9004-7976C1C2E472'	'https://cdn.pilotsolution.net/crm/stock/autocor/7963/7963_118404_desktop.jpeg'	'JEEP'	'WRANGLER'	39900	2011	1	1	101193	'JEEP'	'Autocor Av. Orellana'	'3800'	'2024-11-22')	
('128'	'90AC2FD4-CEA8-4351-9907-EA785F9CA849'	'https://cdn.pilotsolution.net/crm/stock/autocor/7965/7965_120249_desktop.jpeg'	'TOYOTA'	'FORTUNER'	35900	2019	1	1	70000	'SUV'	'Autocor 6 de Diciembre'	'2700'	'2024-11-22')	
('129'	'CA35B78B-AEE0-4052-BFB7-AB696C4E0DFD'	'https://cdn.pilotsolution.net/crm/stock/autocor/7975/7975_118917_desktop.jpeg'	'CHEVROLET'	'BEAT'	12600	2022	1	1	65000	'SEDAN'	'Autocor Valle de los Chillos'	'1200'	'2024-11-23')	
('130'	'B45CB6F4-922C-475B-BE79-F83F7CDDB286'	'https://cdn.pilotsolution.net/crm/stock/autocor/7996/7996_119843_desktop.jpeg'	'TOYOTA'	'YARIS'	19400	2024	1	1	11969	'SEDAN'	'Autocor Shyris'	'1500'	'2024-11-26')	
('131'	'32EFBB3C-7C8A-4422-966F-CD090F776E50'	'https://cdn.pilotsolution.net/crm/stock/autocor/8008/8008_122333_desktop.jpeg'	'CITROEN'	'C3'	15900	2019	1	1	65000	'SUV'	'Autocor La Prensa'	'1200'	'2024-11-27')	
('132'	'76E27DF8-A73D-4224-ADB1-0A1552DF0220'	'https://cdn.pilotsolution.net/crm/stock/autocor/8011/8011_126393_desktop.jpeg'	'BMW'	'X1'	28900	2017	1	1	48000	''	'Autocor Shyris'	'2000'	'2024-11-27')	
('133'	'E735160A-57C4-4211-90B0-35574ABB5BBF'	'https://cdn.pilotsolution.net/crm/stock/autocor/8021/8021_120043_desktop.jpeg'	'KIA'	'STONIC'	16900	2024	1	1	22000	'HIBRIDO'	'Autocor El Recreo'	'1000'	'2024-11-28')	
('134'	'35060204-34DB-4981-836D-E0229FE5ED73'	'https://cdn.pilotsolution.net/crm/stock/autocor/8026/8026_119963_desktop.jpeg'	'PEUGEOT'	'208'	11900	2017	1	1	94000	'HATCHBACK'	'Autocor 6 de Diciembre'	'1600'	'2024-11-29')	
('135'	'B8AA0AB6-AC4C-47DC-8F8E-121046F90649'	'https://cdn.pilotsolution.net/crm/stock/autocor/8032/8032_119770_desktop.jpeg'	'TOYOTA'	'HILUX'	42600	2023	1	1	26000	'CAMIONETA'	'Autocor Eloy Alfaro'	'2700'	'2024-11-29')	
('136'	'32C3F623-E363-4A90-AF11-1FD4C289F560'	'https://cdn.pilotsolution.net/crm/stock/autocor/8036/8036_120427_desktop.jpeg'	'VOLKSWAGEN'	'VIRTUS'	16900	2022	1	1	43000	'SEDAN'	'Autocor Av. Orellana'	'1600'	'2024-11-30')	
('137'	'D923E267-4577-4138-B79B-9C2F7527E9D5'	'https://cdn.pilotsolution.net/crm/stock/autocor/8038/8038_124519_desktop.jpeg'	'HYUNDAI'	'NEW ACCENT'	20600	2024	1	1	8000	'SEDAN'	'Autocor Eloy Alfaro'	'1600'	'2024-11-30')	
('138'	'336D242F-48CD-42F8-99B3-38BCA2F17CDD'	'https://cdn.pilotsolution.net/crm/stock/autocor/8039/8039_121234_desktop.jpeg'	'CHANGAN'	'ALSVIN'	12900	2024	1	1	10050	'SEDAN'	'Autocor Valle de los Chillos'	'1400'	'2024-11-30')	
('139'	'74E8AE3A-B11A-4891-8161-9CDAE0B907B3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8045/8045_124062_desktop.jpeg'	'VOLKSWAGEN'	'TCROSS'	24600	2023	1	1	24000	'HATCHBACK'	'Autocor Shyris'	'1600'	'2024-11-30')	
('140'	'3ECA0936-B15E-4C86-B165-A3EEEE3124C8'	'https://cdn.pilotsolution.net/crm/stock/autocor/8047/8047_121406_desktop.jpeg'	'HYUNDAI'	'GRAND I10'	10900	2015	1	1	149000	'HATCHBACK'	'Autocor La Prensa'	'1200'	'2024-11-30')	
('141'	'AE59B92C-B889-4D4E-BC99-0D4B69EA03C1'	'https://cdn.pilotsolution.net/crm/stock/autocor/8049/8049_120283_desktop.jpeg'	'TOYOTA'	'HILUX'	48900	2020	1	1	97000	'CAMIONETA'	'Autocor 6 de Diciembre'	'2700'	'2024-12-01')	
('142'	'8A5CD846-845C-4871-8325-27AF02CF6771'	'https://cdn.pilotsolution.net/crm/stock/autocor/8051/8051_120142_desktop.jpeg'	'VOLKSWAGEN'	'AMAROK'	20900	2017	1	1	129000	'CAMIONETA'	'Autocor El Recreo'	'2000'	'2024-12-01')	
('143'	'10A47D1E-FBA6-4BC2-AA17-DFF419441F1E'	'https://cdn.pilotsolution.net/crm/stock/autocor/8053/8053_121641_desktop.jpeg'	'KIA'	'PICANTO'	13900	2022	1	1	18000	'HATCHBACK'	'Autocor Av. Orellana'	'1200'	'2024-12-02')	
('144'	'41DCB443-C5F6-47ED-8ED8-0B92A3446A54'	'https://cdn.pilotsolution.net/crm/stock/autocor/8058/8058_120371_desktop.jpeg'	'HYUNDAI'	'GRAND I10'	15900	2024	1	1	9400	'HATCHBACK'	'Autocor Shyris'	'1200'	'2024-12-02')	
('145'	'154AFE84-37BF-490A-B2E5-06B356CD9E9B'	''	'CHEVROLET'	'GRAND VITARA'	13600	2016	1	1	119000	'SUV'	'Autocor Av. Orellana'	'2400'	'2024-12-03')	
('146'	'80E048D0-0746-4363-9ABC-CFAC25078396'	'https://cdn.pilotsolution.net/crm/stock/autocor/8069/8069_122480_desktop.jpeg'	'TOYOTA'	'FORTUNER'	49900	2023	1	1	11900	'SUV'	'Autocor 6 de Diciembre'	'2700'	'2024-12-03')	
('147'	'7C8C6445-F7E9-463B-A7D5-6F5B892E1E30'	'https://cdn.pilotsolution.net/crm/stock/autocor/8070/8070_121982_desktop.jpeg'	'TOYOTA'	'RAV4'	25600	2019	1	1	121850	''	'Autocor Shyris'	'Usados'	'2024-12-03')	
('148'	'B410A979-8FB2-4D7B-A0F0-13206E68FFBE'	'https://cdn.pilotsolution.net/crm/stock/autocor/8086/8086_122116_desktop.jpeg'	'CHEVROLET'	'DMAX'	18900	2017	1	1	57000	'CABINA SIMPLE'	'Autocor Valle de los Chillos'	'2400'	'2024-12-04')	
('149'	'225DB434-6D93-4974-9A14-F5F742C56BB1'	'https://cdn.pilotsolution.net/crm/stock/autocor/8087/8087_124099_desktop.jpeg'	'VOLKSWAGEN'	'GOL'	9900	2011	1	1	90000	'HATCHBACK'	'Autocor Av. Orellana'	'1600'	'2024-12-04')	
('150'	'451E54DE-3ECF-4E6D-87D0-78CC77D800B2'	'https://cdn.pilotsolution.net/crm/stock/autocor/8090/8090_121457_desktop.jpeg'	'RAM'	'V700'	16900	2024	1	1	27000	'FURGON'	'Autocor Av. Orellana'	'1400'	'2024-12-04')	
('151'	'7E1135BA-69A2-4A34-B46F-63933D8987E3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8091/8091_122967_desktop.jpeg'	'CHEVROLET'	'DMAX'	25400	2023	1	1	55000	'CAMIONETA'	'Autocor Av. Orellana'	'2500'	'2024-12-04')	
('152'	'39BE7734-731F-4E22-BED0-914EB8790ADB'	''	'CHEVROLET'	'DMAX'		2024	1	1	26000	''	''	'Usados'	'2024-12-05')	
('153'	'71CFCEF0-2B9D-4E5A-92EF-D4FE3EDAE2C7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8096/8096_121548_desktop.jpeg'	'CHEVROLET'	'DMAX'	26900	2022	1	1	40000	'CAMIONETA'	'Autocor Av. Orellana'	'2500'	'2024-12-05')	
('154'	'0CC8984E-943E-49FA-A067-9AD15785398E'	''	'TOYOTA'	'LAND CRUSSER'	57900	2016	1	1	76768	'JEEP'	'Autocor 6 de Diciembre'	'4000'	'2024-12-05')	
('155'	'F008E135-7154-49FD-AF49-523BE2A706D3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8099/8099_120760_desktop.jpeg'	'FORD'	'EXPLORER'	30400	2016	1	1	68000	'SUV'	'Autocor Eloy Alfaro'	'3500'	'2024-12-05')	
('156'	'5A94EE8F-6D72-417D-9A0D-621A355878F7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8107/8107_120878_desktop.jpeg'	'AUDI'	'Q5'	24400	2015	1	1	113000	'SUV'	'Autocor 6 de Diciembre'	'2000'	'2024-12-05')	
('157'	'87B5C865-66BF-42C7-9292-F58170B6160F'	'https://cdn.pilotsolution.net/crm/stock/autocor/8112/8112_120926_desktop.jpeg'	'FOTON'	'TUNLAND'	21900	2024	1	1	88000	'CAMIONETA'	'Autocor Eloy Alfaro'	'2000'	'2024-12-06')	
('158'	'7BAD8BF3-DF7E-43D0-96D6-DFDD0D0DCBC3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8117/8117_123950_desktop.jpeg'	'HYUNDAI'	'NEW SANTA FE'	27400	2020	1	1	40000	'SUV'	'Autocor Shyris'	'2400'	'2024-12-07')	
('159'	'CE09E395-CEBC-4383-8464-36D2E62F2FF3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8118/8118_121140_desktop.jpeg'	'HONDA'	'PILOT'	45900	2020	1	1	41500	'JEEP UTILITARIO'	'Autocor Shyris'	'3500'	'2024-12-07')	
('160'	'73412047-5CDE-4DC5-8479-CD9DAEEE86D0'	'https://cdn.pilotsolution.net/crm/stock/autocor/8123/8123_123447_desktop.jpeg'	'FIAT'	'PALIO'	8900	2013	1	1	99600	'HATCHBACK'	'Autocor 6 de Diciembre'	'1400'	'2024-12-07')	
('161'	'19125395-1CA3-40C8-941E-ADF2B248AD53'	'https://cdn.pilotsolution.net/crm/stock/autocor/8131/8131_125090_desktop.jpeg'	'CHEVROLET'	'BEAT'	12600	2022	1	1	71500	'SEDAN'	'Autocor Valle de los Chillos'	'1200'	'2024-12-09')	
('162'	'A29A5950-EDED-4C66-8AF2-F26B90CE4F40'	'https://cdn.pilotsolution.net/crm/stock/autocor/8137/8137_125789_desktop.jpeg'	'TOYOTA'	'4RUNNER'	39600	2012	1	1	174500	'SUV'	'Autocor Valle de los Chillos'	'4000'	'2024-12-09')	
('163'	'00C131F0-F764-4C91-8241-CAABC1CD74D9'	'https://cdn.pilotsolution.net/crm/stock/autocor/8140/8140_121792_desktop.jpeg'	'FORD'	'TERRITORY'	20600	2022	1	1	41000	'SUV'	'Autocor Eloy Alfaro'	'1500'	'2024-12-09')	
('164'	'1EBC53C2-73A8-4720-BAC9-1D4C45108E25'	'https://cdn.pilotsolution.net/crm/stock/autocor/8141/8141_121829_desktop.jpeg'	'HYUNDAI'	'TUCSON'	32900	2024	1	1	0	'SUV'	'Autocor Shyris'	'2000'	'2024-12-09')	
('165'	'0145EFDE-D305-415C-AD1E-E94B556B95D9'	'https://cdn.pilotsolution.net/crm/stock/autocor/8148/8148_126276_desktop.jpeg'	'DOMY'	'X5'	9900	2018	1	1	131000	'SUV'	'Autocor El Recreo'	'1500'	'2024-12-10')	
('166'	'C271025B-429E-4BBE-AECB-E950827E98DF'	''	'DONGFENG'	'RICH 6'	17900	2022	1	1	73000	'CAMIONETA'	'Autocor Valle de los Chillos'	'2500'	'2024-12-10')	
('167'	'95347C25-96FC-44C8-AE02-C22BC2A6BD42'	'https://cdn.pilotsolution.net/crm/stock/autocor/8153/8153_122761_desktop.jpeg'	'KIA'	'RIO'	17900	2023	1	1	33000	'AUTOMATICO'	'Autocor Av. Orellana'	'1400'	'2024-12-10')	
('168'	'C02DB96E-9F90-484A-B897-373901BA7FAF'	'https://cdn.pilotsolution.net/crm/stock/autocor/8155/8155_126887_desktop.jpeg'	'TOYOTA'	'AUT FORTUNER'	18400	2011	1	1	254000	'SUV'	'Autocor Valle de los Chillos'	'2700'	'2024-12-11')	
('169'	'84EEA67C-2348-4002-B57C-D50F9F578486'	'https://cdn.pilotsolution.net/crm/stock/autocor/8170/8170_122560_desktop.jpeg'	'KIA'	'SPORTAGE'	30900	2023	1	1	22000	'SUV'	'Autocor Shyris'	'2000'	'2024-12-11')	
('170'	'AEA03F39-95CD-4D8F-8D4C-F97FC5434744'	'https://cdn.pilotsolution.net/crm/stock/autocor/8172/8172_122427_desktop.jpeg'	'KIA'	'OPTIMA'	13900	2018	1	1	140000	'SEDAN'	'Autocor 6 de Diciembre'	'2000'	'2024-12-11')	
('171'	'86845DA6-7294-4AF7-98B1-91F0505E0D6A'	''	'HYUNDAI'	'CRETA'	17900	2019	1	1	75000	'SUV'	'Autocor Eloy Alfaro'	'1600'	'2024-12-12')	
('172'	'63724368-7F34-4DBF-A94D-9291889A6F13'	'https://cdn.pilotsolution.net/crm/stock/autocor/8177/8177_124719_desktop.jpeg'	'AUDI'	'Q3'	45900	2024	1	1	7873	'SUV'	'Autocor Shyris'	'2000'	'2024-12-12')	
('173'	'67A450FC-D0CD-49B5-B909-D5E02D24D9EC'	'https://cdn.pilotsolution.net/crm/stock/autocor/8178/8178_122881_desktop.jpeg'	'KIA'	'SPORTAGE'	23900	2021	1	1	53000	''	'Autocor Shyris'	'Usados'	'2024-12-12')	
('174'	'9FDA6682-28EA-49FE-A316-47EF3F44790E'	''	'CHEVROLET'	'SPARK'		2018	1	1	91000	''	''	'Usados'	'2024-12-12')	
('175'	'7E59F3BD-FBD3-4C40-90BE-A81B46B11E4E'	'https://cdn.pilotsolution.net/crm/stock/autocor/8184/8184_122918_desktop.jpeg'	'TOYOTA'	'NEW FORTUNER'	42900	2019	1	1	103000	''	'Autocor Av. Orellana'	'4000'	'2024-12-12')	
('176'	'493662D2-0358-4F16-B22A-3CC0398E8163'	''	'CHEVROLET'	'DMAX'	28900	2020	1	1	85000	'CAMIIONETA'	'Autocor Valle de los Chillos'	'NO'	'2024-12-13')	
('177'	'6ED01CF0-0E68-4E3C-9722-D755DAA8C145'	'https://cdn.pilotsolution.net/crm/stock/autocor/8190/8190_123101_desktop.jpeg'	'HYUNDAI'	'KONA'	23400	2023	1	1	4000	'SUV'	'Autocor Shyris'	'1600'	'2024-12-13')	
('178'	'7005CEE2-7CDD-47ED-98DF-0DCB07099C72'	''	'NISSAN'	'XTRAIL'	13900	2014	1	1	133000	''	'Autocor Av. Orellana'	'2500'	'2024-12-13')	
('179'	'135D49BC-A723-4B72-B405-324C806D3199'	'https://cdn.pilotsolution.net/crm/stock/autocor/8198/8198_123313_desktop.jpeg'	'FORD'	'EXPLORER'	60900	2021	1	1	70000	'SUV'	'Autocor Eloy Alfaro'	'2300'	'2024-12-14')	
('180'	'5F8E78BC-29D2-41E1-8996-6D8F103EB0F1'	'https://cdn.pilotsolution.net/crm/stock/autocor/8213/8213_125852_desktop.jpeg'	'KIA'	'SPORTAGE'	17900	2015	1	1	120000	'SUV'	'Autocor Valle de los Chillos'	'2000'	'2024-12-16')	
('181'	'DED68258-F604-4717-8D07-FE0C86DCC278'	'https://cdn.pilotsolution.net/crm/stock/autocor/8217/8217_124215_desktop.jpeg'	'MAZDA'	'NEW MAZDA 6'	22900	2019	1	1	55000	'SEDAN'	'Autocor Shyris'	'2000'	'2024-12-16')	
('182'	'DE5766F6-B4B4-4FA6-939C-2FC83855BE5C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8218/8218_124241_desktop.jpeg'	'FORD'	'ECOSPORT'	7900	2005	1	1	224000	'SUV'	'Autocor El Recreo'	'2000'	'2024-12-16')	
('183'	'13DFD8EC-8292-4C12-8F47-A22EE4FCDC14'	'https://cdn.pilotsolution.net/crm/stock/autocor/8222/8222_124600_desktop.jpeg'	'KTM'	'RC 200'	4600	2022	1	1	150	'MOTOCICLETA'	'Autocor Shyris'	'200'	'2024-12-17')	
('184'	'E7B4F47F-83C9-4082-937F-AD15000AA5D7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8223/8223_124276_desktop.jpeg'	'VOLKSWAGEN'	'AMAROK'	24900	2017	1	1	116000	'CAMIONETA'	'Autocor Valle de los Chillos'	'2000'	'2024-12-17')	
('185'	'750739C8-2AD8-4004-9D9B-6D8B22E94C6A'	'https://cdn.pilotsolution.net/crm/stock/autocor/8225/8225_125833_desktop.jpeg'	'KIA'	'RIO'	13900	2019	1	1	30000	''	'Autocor Av. Orellana'	'1400'	'2024-12-17')	
('186'	'93B6CACD-3636-4C1C-9444-380BF7879DCF'	'https://cdn.pilotsolution.net/crm/stock/autocor/8227/8227_124482_desktop.jpeg'	'SUZUKI'	'GRAND VITARA'	11600	2015	1	1	199500	'SUV'	'Autocor El Recreo'	'2400'	'2024-12-17')	
('187'	'0DAEAF58-77C9-42A7-93F8-9719D0404045'	'https://cdn.pilotsolution.net/crm/stock/autocor/8228/8228_126100_desktop.jpeg'	'FORD'	'ECOSPORT'	17600	2020	1	1	45000	'JEEP'	'Autocor Av. Orellana'	'2000'	'2024-12-17')	
('188'	'1625A111-9253-49CC-A9B2-4D16BBEAD625'	''	'FORD'	'EDGE'	22900	2017	1	1	98000	'SUV'	'Autocor Eloy Alfaro'	'3500'	'2024-12-17')	
('189'	'F36EDFDD-4F6F-4798-AAD7-0C45E9136726'	'https://cdn.pilotsolution.net/crm/stock/autocor/8231/8231_124644_desktop.jpeg'	'TOYOTA'	'NEW FORTUNER'	31600	2017	1	1	154186	'SUV'	'Autocor Shyris'	'2700'	'2024-12-17')	
('190'	'FBE79593-952C-499E-9121-BC3CB4D52BA9'	'https://cdn.pilotsolution.net/crm/stock/autocor/8232/8232_126296_desktop.jpeg'	'RENAULT'	'STEPWAY'	17400	2024	1	1	17000	'Hatchback'	'Autocor La Prensa'	'1598'	'2024-12-17')	
('191'	'4814BBA5-11B6-488D-BB1A-18463F6448C5'	''	'NISSAN'	'QASHQAI'	11900	2013	1	1	121000	'SUV'	'Autocor La Prensa'	'2000'	'2024-12-18')	
('192'	'C492B878-2550-4D3F-9DC4-B8B7D409A641'	''	'CHEVROLET'	'TRAILBLAZER'	30900	2018	1	1	126100	'SUV'	'Autocor Valle de los Chillos'	'2800'	'2024-12-18')	
('193'	'19A7FEF2-C002-46F6-B85B-B3AF0CD48EC2'	''	'SUZUKI'	'SCROSS'	14900	2019	1	1	39000	''	''	'Usados'	'2024-12-18')	
('194'	'C0FD8C76-54BF-42B8-80AB-360DC96F12BF'	''	'SUZUKI'	'GRAND VITARA'	11400	2010	1	1	108000	'SUV'	'Autocor Eloy Alfaro'	'2000'	'2024-12-18')	
('195'	'F1CAF1A1-E8FC-4168-9013-EAAE9E5FE1E7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8239/8239_124999_desktop.jpeg'	'VOLKSWAGEN'	'NEW BEETLE'	13600	2009	1	1	103000	'HATCHBACK'	'Autocor Cumbaya'	'1600'	'2024-12-18')	
('196'	'85543C9E-BD69-4623-97D6-4FE567C9F589'	'https://cdn.pilotsolution.net/crm/stock/autocor/8243/8243_125992_desktop.jpeg'	'TOYOTA'	'COROLLA'	19900	2020	1	1	65000	'HATCHBACK'	'Autocor Av. Orellana'	'1798'	'2024-12-18')	
('197'	'8163C6B4-2DEA-4DEE-984C-0BEA9B17AF5B'	''	'PORSCHE'	'MACAN'	78900	2021	1	1	30000	'SUV'	'Autocor Shyris'	'2000'	'2024-12-18')	
('198'	'43EA20E7-28F3-4767-BF1C-BFFCDA67E3DB'	'https://cdn.pilotsolution.net/crm/stock/autocor/8247/8247_126183_desktop.jpeg'	'KIA'	'SPORTAGE'	29900	2023	1	1	42000	'JEEP'	'Autocor Av. Orellana'	'2000'	'2024-12-18')	
('199'	'3AAEF7B7-3001-49AD-80E1-53FE1E4C5F33'	'https://cdn.pilotsolution.net/crm/stock/autocor/8254/8254_125022_desktop.jpeg'	'FORD'	'F150'	39900	2020	1	1	126400	'CAMIONETA'	'Autocor Valle de los Chillos'	'3300'	'2024-12-19')	
('200'	'6AE1342D-0A3F-4EAD-BDB8-3E05458B70C7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8255/8255_127451_desktop.jpeg'	'TOYOTA'	'HILUX'	34900	2020	1	1	97000	'CAMIONETA'	'Autocor Eloy Alfaro'	'2700'	'2024-12-19')	
('201'	'8F06A1CE-5141-4A19-9ED6-C089778AE7E9'	'https://cdn.pilotsolution.net/crm/stock/autocor/8257/8257_125342_desktop.jpeg'	'MERCEDES BENZ'	'ML'	18900	2007	1	1	116800	''	'Autocor Shyris'	'Usados'	'2024-12-19')	
('202'	'35083150-1196-4D9B-B70D-CE3E8BB3B4BA'	'https://cdn.pilotsolution.net/crm/stock/autocor/8260/8260_128652_desktop.jpeg'	'PEUGEOT'	'3008N'	21400	2020	1	1	82000	'SUV'	'Autocor Shyris'	'1600'	'2024-12-19')	
('203'	'B538A387-4404-471F-8486-22935B2B3F68'	'https://cdn.pilotsolution.net/crm/stock/autocor/8262/8262_125608_desktop.jpeg'	'AUDI'	'Q7'	31900	2015	1	1	56000	'SUV'	'Autocor Eloy Alfaro'	'3000'	'2024-12-19')	
('204'	'1CBCF542-DE05-4375-B6EA-5E57EB11EB6F'	'https://cdn.pilotsolution.net/crm/stock/autocor/8263/8263_125111_desktop.jpeg'	'JEEP'	'GRAND CHEROKEE'	23900	2013	1	1	112000	'SUV'	'Autocor Cumbaya'	'3600'	'2024-12-19')	
('205'	'859C6A02-F65D-4A00-846B-2F3F53BE8D5C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8266/8266_125214_desktop.jpeg'	'HYUNDAI'	'SANTA FE'	25900	2020	1	1	104000	'SUV'	'Autocor 6 de Diciembre'	'2400'	'2024-12-19')	
('206'	'50FF354F-22F4-4B21-8AF7-C0F8B23BFA5E'	'https://cdn.pilotsolution.net/crm/stock/autocor/8268/8268_127021_desktop.jpeg'	'SOUEAST'	'DX3'	11900	2019	1	1	38000	'SUV'	'Autocor Valle de los Chillos'	'1500'	'2024-12-20')	
('207'	'3700FB96-4543-4C95-B0AC-66F9A2AD839C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8270/8270_128348_desktop.jpeg'	'SUZUKI'	'GRAND VITARA'	12400	2011	1	1	160000	'SUV'	'Autocor Eloy Alfaro'	'2400'	'2024-12-20')	
('208'	'9FF7C4AD-CEB9-4530-A977-45DFD02EF1D9'	'https://cdn.pilotsolution.net/crm/stock/autocor/8278/8278_126238_desktop.jpeg'	'MAZDA'	'NEW CX5'	26900	2022	1	1	37000	'SUV'	'Autocor Av. Orellana'	'2000'	'2024-12-20')	
('209'	'7B49872E-5932-4876-B2DC-DFC82ADAB2F4'	'https://cdn.pilotsolution.net/crm/stock/autocor/8279/8279_127147_desktop.jpeg'	'JETOUR'	'DASHING'	22400	2024	1	1	79	'SUV'	'Autocor El Recreo'	'1500'	'2024-12-20')	
('210'	'9667D595-F386-4C76-B0B3-E8C05889ACFF'	'https://cdn.pilotsolution.net/crm/stock/autocor/8280/8280_127162_desktop.jpeg'	'JETOUR'	'DASHING'	22400	2024	1	1	0	'SUV'	'Autocor La Prensa'	'1500'	'2024-12-20')	
('211'	'0C0FE345-5A0C-4C54-A8E5-1770AD26D433'	'https://cdn.pilotsolution.net/crm/stock/autocor/8292/8292_125504_desktop.jpeg'	'TOYOTA'	'COROLLA'	31900	2024	1	1	19000	'SUV'	'Autocor 6 de Diciembre'	'1800'	'2024-12-20')	
('212'	'F109D3C7-79E0-4789-B957-627B810E7121'	'https://cdn.pilotsolution.net/crm/stock/autocor/8293/8293_126350_desktop.jpeg'	'NISSAN'	'XTRAIL'	16400	2015	1	1	106000	'SUV'	'Autocor La Prensa'	'2500'	'2024-12-20')	
('213'	'F00D237C-F624-4774-9823-E15DEBA44FCB'	'https://cdn.pilotsolution.net/crm/stock/autocor/8294/8294_125443_desktop.jpeg'	'FORD'	'F150'	35400	2018	1	1	158000	'CAMIONETA'	'Autocor Eloy Alfaro'	'3300'	'2024-12-20')	
('214'	'9E5FB2F2-9140-41D1-BABF-AB729DEDCBE7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8300/8300_129054_desktop.jpeg'	'FORD'	'EXPLORER'	8400	1999	1	1	177000	''	'Autocor Av. Orellana'	'4000'	'2024-12-21')	
('215'	'4D6F742B-2596-4590-8577-8BF9E86C123C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8302/8302_126162_desktop.jpeg'	'HYUNDAI'	'IONIQ'	13900	2018	1	1	94000	'SEDAN'	'Autocor Valle de los Chillos'	'1600'	'2024-12-21')	
('216'	'688CC31B-4F37-48DD-BD52-B82DD24283F7'	'https://cdn.pilotsolution.net/crm/stock/autocor/8308/8308_127960_desktop.jpeg'	'MITSUBISHI'	'ASX'	15900	2013	1	1	74748	'SUV'	'Autocor Av. Orellana'	'2000'	'2024-12-23')	
('217'	'FA4D7F8D-2CBF-430C-B9AE-E09AFC4A5B75'	'https://cdn.pilotsolution.net/crm/stock/autocor/8309/8309_128450_desktop.jpeg'	'PEUGEOT'	'3008N'	19400	2019	1	1	85600	'SUV'	'Autocor Shyris'	'1600'	'2024-12-23')	
('218'	'12268065-3C36-48AC-BFE4-D82C7597CCFC'	''	'KIA'	'NIRO'	13900	2018	1	1	129000	'SUV'	'Autocor Valle de los Chillos'	'1600'	'2024-12-23')	
('219'	'CAE2A3B7-C8EE-4793-9064-F54720CF05BC'	'https://cdn.pilotsolution.net/crm/stock/autocor/8319/8319_126803_desktop.jpeg'	'MERCEDES BENZ'	'A200'	30900	2020	1	1	36000	'SEDAN'	'Autocor Cumbaya'	'1300'	'2024-12-23')	
('220'	'7F58F950-81E6-43A9-9326-23C113652630'	'https://cdn.pilotsolution.net/crm/stock/autocor/8321/8321_126737_desktop.jpeg'	'HYUNDAI'	'SONATA'	29900	2024	1	1	10000	'SEDAN'	'Autocor Shyris'	'2000'	'2024-12-24')	
('221'	'792DB64D-CF42-4F65-9F2B-F67599EF2F87'	'https://cdn.pilotsolution.net/crm/stock/autocor/8335/8335_126633_desktop.jpeg'	'TOYOTA'	'FORTUNER'	39600	2020	1	1	79000	'SUV'	'Autocor Valle de los Chillos'	'2700'	'2024-12-26')	
('222'	'78387174-C54C-4091-9536-94C5FB92010B'	'https://cdn.pilotsolution.net/crm/stock/autocor/8340/8340_127722_desktop.jpeg'	'TOYOTA'	'NEW FORTUNER'	31900	2018	1	1	133000	'SUV'	'Autocor Shyris'	'2700'	'2024-12-26')	
('223'	'AD2AFDC1-39F3-416B-8A6A-BFD4A7D74E13'	'https://cdn.pilotsolution.net/crm/stock/autocor/8342/8342_128367_desktop.jpeg'	'FORD'	'EXPLORER'	36900	2019	1	1	65000	'SUV'	'Autocor 6 de Diciembre'	'3500'	'2024-12-26')	
('224'	'847F2FC4-3EAF-4560-8566-D88A0EAF4B5A'	'https://cdn.pilotsolution.net/crm/stock/autocor/8344/8344_128735_desktop.jpeg'	'RENAULT'	'LOGAN DYNAMIQUE'	9900	2019	1	1	117300	'SEDAN'	'Autocor Valle de los Chillos'	'1600'	'2024-12-26')	
('225'	'F8266CE8-6218-4EAB-96E7-CA15F4E7ED3C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8349/8349_126806_desktop.jpeg'	'OPEL'	'CORSA'	16900	2023	1	1	28000	'HATCHBACK'	'Autocor 6 de Diciembre'	'1200'	'2024-12-27')	
('226'	'FF8386EA-E3F8-476F-A35D-6CEEB051093B'	'https://cdn.pilotsolution.net/crm/stock/autocor/8351/8351_127289_desktop.jpeg'	'NISSAN'	'VERSA'	15900	2020	1	1	81000	'SEDAN'	'Autocor 6 de Diciembre'	'1600'	'2024-12-27')	
('227'	'DF6246C2-D519-4590-B73A-AD4EC2841CB3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8353/8353_126827_desktop.jpeg'	'KIA'	'SPORTAGE'	20900	2017	1	1	101000	'SUV'	'Autocor 6 de Diciembre'	'2000'	'2024-12-27')	
('228'	'92E0DD5B-6B16-4FB6-9B2B-8B52F68FDA40'	''	'NISSAN'	'XTRAIL'		2013	1	1	145405	''	''	'Usados'	'2024-12-27')	
('229'	'C6DE1C68-5470-41DB-9483-72FA1685078D'	''	'NISSAN'	'XTRAIL'		2013	1	1	145405	''	''	'Usados'	'2024-12-27')	
('230'	'0989B573-4C66-4A3B-8DE3-37BE6D77AF97'	'https://cdn.pilotsolution.net/crm/stock/autocor/8356/8356_128974_desktop.jpeg'	'FAW'	'T33'	11900	2022	1	1	55000	'SUV'	'Autocor La Prensa'	'1600'	'2024-12-27')	
('231'	'02600486-EA57-45B3-BD59-7D57E7821562'	'https://cdn.pilotsolution.net/crm/stock/autocor/8358/8358_127379_desktop.jpeg'	'RENAULT'	'CAPTUR'	17900	2020	1	1	75000	'JEEP'	'Autocor Av. Orellana'	'2000'	'2024-12-27')	
('232'	'B140F36D-CC37-44AF-B5F9-5EC7117B8197'	''	'FORD'	'F150'		2016	1	1	119000	''	''	'Usados'	'2024-12-27')	
('233'	'5EDA0AA5-6FAE-41A4-9208-D1705FA60E5E'	'https://cdn.pilotsolution.net/crm/stock/autocor/8364/8364_129483_phablet.jpeg'	'JEEP'	'NEW COMPASS'	21400	2018	1	1	66000	'JEEP'	'Autocor Av. Orellana'	'2400'	'2024-12-27')	
('234'	'F35AE7ED-A607-45E3-9B42-2407CB907B58'	'https://cdn.pilotsolution.net/crm/stock/autocor/8366/8366_128082_desktop.jpeg'	'FORD'	'EXPLORER'	32400	2018	1	1	70000	'SUV'	'Autocor 6 de Diciembre'	'3500'	'2024-12-27')	
('235'	'5C89CDC3-FE4D-49D3-8D2A-FE80BB0596A2'	'https://cdn.pilotsolution.net/crm/stock/autocor/8367/8367_128248_desktop.jpeg'	'TOYOTA'	'NEW FORTUNER'	36400	2018	1	1	42000	'SUV'	'Autocor Eloy Alfaro'	'2700'	'2024-12-28')	
('236'	'B785261B-46AF-4972-BC7F-63A114A3323E'	'https://cdn.pilotsolution.net/crm/stock/autocor/8368/8368_129363_desktop.jpeg'	'KIA'	'SPORTAGE SL'	20600	2019	1	1	130000	'SUV'	'Autocor Valle de los Chillos'	'2000'	'2024-12-28')	
('237'	'3C814A34-7BD7-4D6D-9CDB-886D24302F06'	'https://cdn.pilotsolution.net/crm/stock/autocor/8369/8369_127107_desktop.jpeg'	'FORD'	'F150'	37900	2018	1	1	86000	'CAMIONETA'	'Autocor Valle de los Chillos'	'3300'	'2024-12-28')	
('238'	'6E5DD84E-759B-4D61-8DB4-C31BBE5F3ED2'	'https://cdn.pilotsolution.net/crm/stock/autocor/8370/8370_127002_desktop.jpeg'	'MAZDA'	'NEW BT-50'	27400	2018	1	1	128000	'CAMIONETA'	'Autocor Valle de los Chillos'	'3200'	'2024-12-28')	
('239'	'5C45CE4B-AF75-4990-A94F-D7046C6FC55F'	''	'CHEVROLET'	'CAPTIVA'	17900	2023	1	1	29460	'JEEP'	'Autocor Av. Orellana'	'1500'	'2024-12-28')	
('240'	'EE3B7145-EF8B-4AE7-9C39-512C5F30A086'	'https://cdn.pilotsolution.net/crm/stock/autocor/8375/8375_127869_desktop.jpeg'	'RAM'	'1500'	48600	2022	1	1	45000	'CAMIONETA'	'Autocor Shyris'	'3600'	'2024-12-28')	
('241'	'1EBDE441-384D-4649-A084-C98E3450C072'	''	'FOTON'	'TUNLAND'	20900	2023	1	1	89803	'DOBLE CABINA'	'Autocor La Prensa'	'2000'	'2024-12-28')	
('242'	'07408443-D8B6-45EC-BA71-EC3963A853F0'	'https://cdn.pilotsolution.net/crm/stock/autocor/8380/8380_127493_desktop.jpeg'	'KIA'	'RIO'	8400	2011	1	1	135000	'SEDAN'	'Autocor El Recreo'	'1500'	'2024-12-29')	
('243'	'70AA4DC3-3E2A-4CBC-A156-D62AABCA3CD3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8383/8383_128776_desktop.jpeg'	'PEUGEOT'	'3008N'	23900	2020	1	1	96000	'SUV'	'Autocor Eloy Alfaro'	'1600'	'2024-12-30')	
('244'	'7D3B686C-EF18-4179-B065-91715B4212D5'	'https://cdn.pilotsolution.net/crm/stock/autocor/8388/8388_127801_desktop.jpeg'	'BMW'	'320I'	29900	2018	1	1	60000	'SEDAN'	'Autocor Shyris'	'2000'	'2024-12-30')	
('245'	'10B2B991-A6C4-444B-B3F0-F6E306B9F3BC'	'https://cdn.pilotsolution.net/crm/stock/autocor/8389/8389_127505_desktop.jpeg'	'BMW'	'330I'	41900	2020	1	1	28000	'SEDAN'	'Autocor Cumbaya'	'2000'	'2024-12-30')	
('246'	'1948C30D-104B-4C2D-B97E-B07CB0E5ADC8'	''	'KIA'	'SPORTAGE'	27900	2021	1	1	60000	'JEEP'	'Autocor Av. Orellana'	'1999'	'2024-12-30')	
('247'	'0B42E508-3512-4346-B2D4-EB8555D9CA50'	'https://cdn.pilotsolution.net/crm/stock/autocor/8392/8392_128292_desktop.jpeg'	'CHANGAN'	'CS75'	11900	2018	1	1	120000	'SUV'	'Autocor Eloy Alfaro'	'1800'	'2024-12-30')	
('248'	'F8D0AFDA-8AD7-4F71-999D-9448800349ED'	'https://cdn.pilotsolution.net/crm/stock/autocor/8398/8398_127524_desktop.jpeg'	'MAZDA'	'CX3'	17400	2017	1	1	72000	'CROSSOVER'	'Autocor 6 de Diciembre'	'2000'	'2024-12-30')	
('249'	'D2902503-B704-4CBD-A660-5E9A901DBCA8'	'https://cdn.pilotsolution.net/crm/stock/autocor/8399/8399_127569_desktop.jpeg'	'RENAULT'	'STEPWAY'	14900	2023	1	1	40000	'HATCHBACK'	'Autocor Valle de los Chillos'	'1600'	'2024-12-31')	
('250'	'3684124A-AE60-495E-A713-2ADF2188CBA5'	'https://cdn.pilotsolution.net/crm/stock/autocor/8401/8401_127751_desktop.jpeg'	'GREAT WALL'	'HAVAL H6'	17400	2018	1	1	61000	'SUV'	'Autocor Shyris'	'2000'	'2024-12-31')	
('251'	'AAA76EC1-0DFC-4D8C-97C7-EA82F4D344E0'	'https://cdn.pilotsolution.net/crm/stock/autocor/8403/8403_128114_desktop.jpeg'	'VOLKSWAGEN'	'TIGUAN'	20900	2018	1	1	50000	'SUV'	'Autocor 6 de Diciembre'	'2000'	'2025-01-02')	
('252'	'CA18FFA1-DEE6-43A2-B6C6-2BD09521547C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8405/8405_128414_desktop.jpeg'	'VOLKSWAGEN'	'POLO'	18600	2024	1	1	2000	'HATCHBACK'	'Autocor Cumbaya'	'1600'	'2025-01-02')	
('253'	'A257399C-354E-462D-A939-A55575887304'	''	'JEEP'	'NEW COMPASS'	22400	2018	1	1	44500	''	'Autocor Av. Orellana'	'2400'	'2025-01-03')	
('254'	'5A571FFE-F02A-48F7-8146-D990CBC2D1E5'	'https://cdn.pilotsolution.net/crm/stock/autocor/8412/8412_129872_desktop.jpeg'	'HYUNDAI'	'IONIQ'	13900	2017	1	1	100000	'SEDAN'	'Autocor Av. Orellana'	'1600'	'2025-01-04')	
('255'	'C78AEB00-558D-486E-B0BE-2752F3A82A06'	''	'SHINERAY'	'SWM'	16400	2024	1	1	17000	'JEEP'	'Autocor Av. Orellana'	'1500'	'2025-01-04')	
('256'	'AFBA4C93-E76F-4A39-9029-4D132A4E17C5'	'https://cdn.pilotsolution.net/crm/stock/autocor/8415/8415_128312_desktop.jpeg'	'HYUNDAI'	'VERNA'	14400	2021	1	1	40000	'SEDAN'	'Autocor Eloy Alfaro'	'1400'	'2025-01-04')	
('257'	'68D40F51-41D0-4B7A-ADF6-D2D58EA1B8A3'	'https://cdn.pilotsolution.net/crm/stock/autocor/8416/8416_128195_desktop.jpeg'	'SHINERAY'	'SWM'	15400	2024	1	1	35000	'SUV'	'Autocor 6 de Diciembre'	'1500'	'2025-01-04')	
('258'	'CF14638F-87B9-4600-B664-A7444B4D6725'	'https://cdn.pilotsolution.net/crm/stock/autocor/8405/8405_128417_desktop.jpeg'	'SHINERAY'	'SWM'	14400	2024	1	1	27000	'JEEP'	'Autocor Av. Orellana'	'1500'	'2025-01-04')	
('259'	'BF426157-18E9-448A-B13B-F22130C07118'	'https://cdn.pilotsolution.net/crm/stock/autocor/8418/8418_129071_desktop.jpeg'	'CHEVROLET'	'TRACKER'	13600	2018	1	1	75000	'SUV'	'Autocor Av. Orellana'	'1800'	'2025-01-04')	
('260'	'F8CA0343-0552-4D7D-8D8E-46054168F574'	'https://cdn.pilotsolution.net/crm/stock/autocor/8421/8421_128607_desktop.jpeg'	'CHEVROLET'	'DMAX'	33900	2023	1	1	59000	'CAMIONETA'	'Autocor Valle de los Chillos'	'2500'	'2025-01-04')	
('261'	'91583238-C5A7-4AFC-835D-F8668CE73DCC'	''	'FORD'	'ESCAPE'	14900	2015	1	1	123000	'SUV'	'Autocor 6 de Diciembre'	'2500'	'2025-01-04')	
('262'	'7216E007-2384-4429-8724-BD86E341C29E'	'https://cdn.pilotsolution.net/crm/stock/autocor/8423/8423_129684_desktop.jpeg'	'KIA'	'SPORTAGE'	19400	2017	1	1	137000	'SUV'	'Autocor Shyris'	'2000'	'2025-01-04')	
('263'	'D8C104D0-48C7-47D2-AE12-282345F0E76C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8424/8424_128792_desktop.jpeg'	'CHERY'	'TIGGO 4'	11400	2019	1	1	82000	'SUV'	'Autocor Shyris'	'1500'	'2025-01-04')	
('264'	'69B1BB4B-4660-4DE2-9473-BAEEDB20AD42'	'https://cdn.pilotsolution.net/crm/stock/autocor/8425/8425_129000_desktop.jpeg'	'MAZDA'	'MAZDA3'	19600	2019	1	1	83000	'SEDAN'	'Autocor Av. Orellana'	'2000'	'2025-01-04')	
('265'	'83B0BDBB-655A-4C80-948D-D647C0BBE24C'	'https://cdn.pilotsolution.net/crm/stock/autocor/8426/8426_128170_desktop.jpeg'	'KIA'	'RIO'	12900	2014	1	1	140000	'SEDAN'	'Autocor 6 de Diciembre'	'1400'	'2025-01-04')	
('266'	'EE7D7086-8AAC-44C5-AA85-8324F57E20C8'	'https://cdn.pilotsolution.net/crm/stock/autocor/8427/8427_128144_desktop.jpeg'	'NISSAN'	'VERSA'	18400	2022	1	1	31000	'SEDAN'	'Autocor 6 de Diciembre'	'1600'	'2025-01-04')	
('267'	'7DFA832D-7CAC-4811-A34E-216D227A797B'	'https://cdn.pilotsolution.net/crm/stock/autocor/8430/8430_128537_desktop.jpeg'	'AUDI'	'A4'	18400	2015	1	1	125000	'SEDAN'	'Autocor Valle de los Chillos'	'1800'	'2025-01-06')	
('268'	'92352DEE-CB5E-4753-B1F1-64AB2D67A81D'	'https://cdn.pilotsolution.net/crm/stock/autocor/8431/8431_128486_desktop.jpeg'	'TOYOTA'	'RUSH'	19990	2021	1	1	60000	'SUV'	'Autocor Eloy Alfaro'	'1500'	'2025-01-06')	
('269'	'4C0D7696-D372-44A2-86A6-14840A4BFEC8'	'https://cdn.pilotsolution.net/crm/stock/autocor/8435/8435_128559_desktop.jpeg'	'FORD'	'EXPLORER'	19900	2013	1	1	125000	'SUV'	'Autocor El Recreo'	'3500'	'2025-01-06')	
('270'	'09486A4A-1F98-45BD-9B13-9FAAD1F90B49'	'https://cdn.pilotsolution.net/crm/stock/autocor/8436/8436_129960_desktop.jpeg'	'JEEP'	'COMPASS SPORT AC 2.4 5P 4X4 TA'	13900	2014	1	1	177000	'SUV'	'Autocor Eloy Alfaro'	'Usados'	'2025-01-07')	
('271'	'F9C5F2B7-4BFD-4E56-9B39-C60B0A8F3555'	''	'NISSAN'	'XTRAIL'	11400	2013	1	1	211000	''	'Autocor Av. Orellana'	'Usados'	'2025-01-07')	
('272'	'6D8018B9-1CB3-4D34-8A1B-C183869A6069'	''	'HYUNDAI'	'TUCSON'	13900	2012	1	1	167000	'SUV'	'Autocor Av. Orellana'	'2000'	'2025-01-07')	
('273'	'DF6E9558-260C-424F-B3A6-EE4F7AAD7D27'	'https://cdn.pilotsolution.net/crm/stock/autocor/8441/8441_129169_desktop.jpeg'	'CHEVROLET'	'TRACKER'	10900	2014	1	1	86800	'SUV'	'Autocor Shyris'	'1500'	'2025-01-07')	
('274'	'1E9D42A9-6BD5-49AC-8098-F0426E1493FE'	''	'CHANGAN'	'HUNTER'	26900	2024	1	1	27000	'CAMIONETA'	'Autocor Av. Orellana'	'1900'	'2025-01-07')	
('275'	'5201568E-AA5C-4D11-9751-8E5DF96F336F'	'https://cdn.pilotsolution.net/crm/stock/autocor/8444/8444_128818_desktop.jpeg'	'NISSAN'	'SENTRA'	11900	2014	1	1	87000	'SEDÃN'	'Autocor Valle de los Chillos'	'1800'	'2025-01-07')	
('276'	'FD521B69-E66D-4968-82EE-74F0376ABAFB'	'https://cdn.pilotsolution.net/crm/stock/autocor/8447/8447_128880_desktop.jpeg'	'CHERY'	'TIGGO 4'	16900	2024	1	1	27700	'JEEP'	'Autocor Shyris'	'1500'	'2025-01-07')	
('277'	'1BF1261D-EFB5-4EF4-8273-9E5465CF1F0C'	''	'CHEVROLET'	'DMAX'		2017	1	1	135000	''	''	'Usados'	'2025-01-08')	
('278'	'BE64B137-4491-45A9-A45A-9D9E693D5AB0'	'https://cdn.pilotsolution.net/crm/stock/autocor/8453/8453_130044_desktop.jpeg'	'HYUNDAI'	'TUCSON'	19900	2017	1	1	92000	'JEEP'	'Autocor 6 de Diciembre'	'2000'	'2025-01-08')	
('279'	'A118C71C-EBAB-49F6-96B9-1E4BD0DD8232'	'https://cdn.pilotsolution.net/crm/stock/autocor/8454/8454_129271_desktop.jpeg'	'CHEVROLET'	'D-MAX'	26400	2023	1	1	58000	'CAMIONETA'	'Autocor Eloy Alfaro'	'2500'	'2025-01-08')	
('280'	'52D7ABC4-9D27-4CF2-9756-C2527D34290D'	'https://cdn.pilotsolution.net/crm/stock/autocor/8458/8458_129636_desktop.jpeg'	'MAZDA'	'CX-9'	18600	2014	1	1	148000	'JEEP'	'Autocor Av. Orellana'	'3700'	'2025-01-09')	
('281'	'4C5D1EE3-B566-4CAD-8919-467DE994E7A5'	'https://cdn.pilotsolution.net/crm/stock/autocor/8459/8459_129829_desktop.jpeg'	'MAZDA'	'CX3 CORE'	19400	2019	1	1	72000	'JEEP'	'Autocor Av. Orellana'	'1998'	'2025-01-09')	
('282'	'69A6EC3B-4A24-46C2-B8B1-4C69B243E904'	'https://cdn.pilotsolution.net/crm/stock/autocor/8460/8460_129894_desktop.jpeg'	'HYUNDAI'	'CRETA'	15600	2016	1	1	150000	''	''	'1600'	'2025-01-09')	
('283'	'641AEEB5-7337-4952-95F8-13760B9073DF'	'https://cdn.pilotsolution.net/crm/stock/autocor/8461/8461_129656_desktop.jpeg'	'RENAULT'	'LOGAN DYNAMIQUE'	11900	2018	1	1	44000	'SEDAN'	'Autocor La Prensa'	'1600'	'2025-01-09')	
('284'	'054ADA96-9C6B-4440-9B73-B19982487766'	'https://cdn.pilotsolution.net/crm/stock/autocor/8463/8463_129726_desktop.jpeg'	'NISSAN'	'FRONTIER'	40900	2022	1	1	40000	'CAMIONETA DOBLE CABINA'	'Autocor Shyris'	'2500'	'2025-01-09')	
('285'	'2ECFDBCF-6EED-47B2-B975-B7AD9C0C6D24'	'https://cdn.pilotsolution.net/crm/stock/autocor/8464/8464_130021_desktop.jpeg'	'MAZDA'	'2'	11900	2014	1	1	75000	'SEDAN'	'Autocor 6 de Diciembre'	'1500'	'2025-01-10')	
('286'	'2C6E11BA-6DA0-4549-A3EE-B8401CE4844B'	'https://cdn.pilotsolution.net/crm/stock/autocor/8466/8466_130129_desktop.jpeg'	'CHANGAN'	'CS75'	13400	2019	1	1	77000	'SUV'	'Autocor 6 de Diciembre'	'1800'	'2025-01-10')	
('287'	'175B911A-A9E1-43A7-969A-5CBAAC4DDF5A'	''	'MAZDA'	'CX-3'		2023	1	1	20000	''	''	'Usados'	'2025-01-10')	
('288'	'6ABE7829-D547-47EE-B4E1-9F5095CA6163'	'https://cdn.pilotsolution.net/crm/stock/autocor/8473/8473_129975_desktop.jpeg'	'BYD'	'Seagull'	21400	2025	1	1	272	'HATCHBACK'	'Autocor Cumbaya'	'Usados'	'2025-01-10')	
('289'	'C6527299-3268-442B-B42D-E03ED183B185'	'https://cdn.pilotsolution.net/crm/stock/autocor/8474/8474_130101_desktop.jpeg'	'FORD'	'F150'		2023	1	1	29000	'CAMIONETA'	'Autocor Eloy Alfaro'	'3500'	'2025-01-11')	
('290'	'E197E4A9-3978-4F74-8FE2-1F472A9DA029'	'https://cdn.pilotsolution.net/crm/stock/autocor/8475/8475_130152_desktop.jpeg'	'JEEP'	'COMPASS'	26900	2021	1	1	32000	'SUV'	'Autocor 6 de Diciembre'	'2400'	'2025-01-11')	
('291'	'03EF166D-D4BD-4228-8ADC-57765965126A'	'https://cdn.pilotsolution.net/crm/stock/autocor/8477/8477_130197_desktop.jpeg'	'BMW'	'120I'	20900	2016	1	1	87000	'HATCHBACK'	'Autocor 6 de Diciembre'	'1600'	'2025-01-12')	
('292'	'B575BEEA-5539-42E1-BA4C-800CE2A27535'	''	'SUZUKI'	'GRAND VITARA SZ'		2014	1	1	97000	''	''	'Usados'	'2025-01-13')	
('293'	'70168067-7AC4-475D-B48D-BB5FD8CD30D0'	''	'FORD'	'EXPLORER'		2015	1	1	115000	''	''	'Usados'	'2025-01-13')	
('294'	'D6BB76C8-B579-414C-90BD-CE78B3096EB1'	''	'FORD'	'F150'		2017	1	1	120000	''	'Autocor Shyris'	'Usados'	'2025-01-13');	
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Vehicle`
--
ALTER TABLE `Vehicle`
  ADD PRIMARY KEY (`id_record`),
  ADD UNIQUE KEY `id` (`id_record`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Vehicle`
--
ALTER TABLE `Vehicle`
  MODIFY `id_record` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=320;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
