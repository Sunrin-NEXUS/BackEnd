-- CreateTable
CREATE TABLE `EmailVerification` (
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `uuid` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Company` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `contents` VARCHAR(191) NOT NULL,
    `subscriber` INTEGER NOT NULL DEFAULT 0,
    `userUuid` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_name_key`(`name`),
    INDEX `Company_userUuid_fkey`(`userUuid`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `uuid` VARCHAR(191) NOT NULL,
    `original_url` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `create_date` DATETIME(3) NOT NULL,
    `contents` VARCHAR(191) NOT NULL,
    `summary_img_url` VARCHAR(191) NULL,
    `img_url` VARCHAR(191) NULL,
    `video_url` VARCHAR(191) NULL,
    `media_desc` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `companyId` VARCHAR(191) NOT NULL,

    INDEX `Article_companyId_fkey`(`companyId`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_userUuid_fkey` FOREIGN KEY (`userUuid`) REFERENCES `User`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
