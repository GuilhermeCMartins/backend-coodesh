-- CreateTable
CREATE TABLE `Vendors` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(30) NOT NULL,
    `Password` VARCHAR(100) NOT NULL,
    `Type` ENUM('Creator', 'Member') NOT NULL,

    UNIQUE INDEX `Vendors_Name_key`(`Name`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `MadeAt` DATETIME(3) NOT NULL,
    `Price` DECIMAL(10, 2) NOT NULL,
    `TransactionTypeId` INTEGER NOT NULL,
    `ProductId` INTEGER NOT NULL,
    `VendorId` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransactionTypes` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Description` VARCHAR(100) NOT NULL,
    `Inbound` BOOLEAN NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(100) NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Price` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `Products_Name_key`(`Name`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_TransactionTypeId_fkey` FOREIGN KEY (`TransactionTypeId`) REFERENCES `TransactionTypes`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_ProductId_fkey` FOREIGN KEY (`ProductId`) REFERENCES `Products`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_VendorId_fkey` FOREIGN KEY (`VendorId`) REFERENCES `Vendors`(`Id`) ON DELETE RESTRICT ON UPDATE CASCADE;
