import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Address: any;
  JSON: any;
  Timestamp: any;
};

export type AccountInLiquidationInfo = {
  __typename?: 'AccountInLiquidationInfo';
  accountInfo: LiquidationAccountInfo;
  assets: Array<AssetInLiquidation>;
};

export type AccountNearLiquidationInfo = {
  __typename?: 'AccountNearLiquidationInfo';
  accountInfo: LiquidationAccountInfo;
  assets: Array<AssetNearLiquidation>;
};

export type AggregatedOrderNode = {
  __typename?: 'AggregatedOrderNode';
  aggregatedOrder: ShopBidByPlatform;
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  orderCount: Scalars['Int'];
};

export type AggregatedOrders = {
  __typename?: 'AggregatedOrders';
  nodes?: Maybe<Array<AggregatedOrderNode>>;
  totalCount: Scalars['Int'];
};

export type ApeCount = {
  bakc: Scalars['Int'];
  bayc: Scalars['Int'];
  mayc: Scalars['Int'];
};

export type ApeStakingSummary = {
  __typename?: 'ApeStakingSummary';
  apeCoinStaked: Scalars['String'];
  bakcStaked: Scalars['String'];
  baycStaked: Scalars['String'];
  maycStaked: Scalars['String'];
};

export type ApeWaitlistData = {
  __typename?: 'ApeWaitlistData';
  detail: ApeWaitlistDetail;
  summary: ApeWaitlistSummary;
};

export type ApeWaitlistDetail = {
  __typename?: 'ApeWaitlistDetail';
  email?: Maybe<Scalars['String']>;
  joined: Scalars['Boolean'];
  twitter?: Maybe<Scalars['String']>;
  walletAddress: Scalars['Address'];
};

export type ApeWaitlistSummary = {
  __typename?: 'ApeWaitlistSummary';
  totalCount: Scalars['Int'];
};

export type Asset = {
  __typename?: 'Asset';
  chainId?: Maybe<Scalars['Int']>;
  collection?: Maybe<Collection>;
  contractAddress?: Maybe<Scalars['Address']>;
  currency?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['Timestamp']>;
  identifierOrCriteria: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  isSupplied: Scalars['Boolean'];
  lastPrice?: Maybe<Scalars['String']>;
  lastPriceCurrency?: Maybe<Scalars['String']>;
  listedOn?: Maybe<Marketplace>;
  listingTime?: Maybe<Scalars['Timestamp']>;
  listings?: Maybe<Array<Maybe<Listing>>>;
  multiplier?: Maybe<Scalars['Float']>;
  ownedBy?: Maybe<Scalars['String']>;
  platform?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['String']>;
  protocolContract?: Maybe<Scalars['String']>;
  protocolVersion?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['Timestamp']>;
  topOffer?: Maybe<Order>;
  traits?: Maybe<Array<Maybe<Traits>>>;
};

export type AssetInLiquidation = {
  __typename?: 'AssetInLiquidation';
  auctionStatus: Scalars['Int'];
  collectionName: Scalars['String'];
  contractAddress: Scalars['Address'];
  currentPrice: Scalars['String'];
  currentPriceInUSD: Scalars['Float'];
  currentPriceMultiplier: Scalars['Float'];
  floorPrice: Scalars['String'];
  floorPriceInUSD: Scalars['Float'];
  identifierOrCriteria: Scalars['String'];
  maxPriceMultiplier: Scalars['Float'];
  minExpPriceMultiplier: Scalars['Float'];
  minPriceMultiplier: Scalars['Float'];
  startTime: Scalars['Timestamp'];
  stepExp: Scalars['Float'];
  stepLinear: Scalars['Float'];
  tickLength: Scalars['Float'];
  traitMultiplier: Scalars['String'];
};

export type AssetLiquidationAccountInfo = {
  __typename?: 'AssetLiquidationAccountInfo';
  address: Scalars['Address'];
  collateral: Scalars['String'];
  debt: Scalars['String'];
  healthFactor: Scalars['Float'];
  nftHealthFactor: Scalars['Float'];
};

export type AssetNearLiquidation = Erc20AssetNearLiquidation | Erc721AssetNearLiquidation;

export type AssetsFilter = {
  contractAddress: Scalars['Address'];
  tokenIds: Array<Scalars['String']>;
};

export type AutoCompoundHistory = {
  __typename?: 'AutoCompoundHistory';
  blockTimestamp: Scalars['Timestamp'];
  nftPoolSymbol: Scalars['String'];
  triggeredBy: Scalars['String'];
  txHash: Scalars['String'];
};

export type AutoCompoundHistoryFilter = {
  blockTimestampFrom?: InputMaybe<Scalars['Timestamp']>;
  blockTimestampTo?: InputMaybe<Scalars['Timestamp']>;
};

export type BasicOrderInfo = {
  __typename?: 'BasicOrderInfo';
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  lowestListing?: Maybe<ParaSpaceListing>;
  topOffer?: Maybe<Order>;
  totalOffers: Scalars['Int'];
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Collection = {
  __typename?: 'Collection';
  contractAddress: Scalars['Address'];
  description?: Maybe<Scalars['String']>;
  externalUrl?: Maybe<Scalars['String']>;
  fees?: Maybe<Fees>;
  imageUrl?: Maybe<Scalars['String']>;
  itemCount: Scalars['Int'];
  marketCap: Scalars['Float'];
  name: Scalars['String'];
  paymentTokens: Array<PaymentToken>;
  standard?: Maybe<Scalars['String']>;
  symbol: Scalars['String'];
  topCollectionOffer?: Maybe<Order>;
  totalListedNFTs?: Maybe<TotalListedNfTsCount>;
};

export type ContinuationPageInfo = {
  continuation?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
};

export type CreditData = {
  __typename?: 'CreditData';
  amount: Scalars['String'];
  orderId: Scalars['String'];
  token: Scalars['Address'];
  vrs: CreditDataSignature;
};

export type CreditDataSignature = {
  __typename?: 'CreditDataSignature';
  r: Scalars['String'];
  s: Scalars['String'];
  v: Scalars['String'];
};

export type Erc20AssetNearLiquidation = {
  __typename?: 'ERC20AssetNearLiquidation';
  amount: Scalars['String'];
  decimal: Scalars['Int'];
  symbol: Scalars['String'];
  type: NearLiquidationAssetType;
  valueInUSD: Scalars['Float'];
};

export type Erc721AssetNearLiquidation = {
  __typename?: 'ERC721AssetNearLiquidation';
  collectionName: Scalars['String'];
  contractAddress: Scalars['Address'];
  floorPrice: Scalars['String'];
  floorPriceInUSD: Scalars['Float'];
  identifierOrCriteria: Scalars['String'];
  traitMultiplier: Scalars['String'];
  type: NearLiquidationAssetType;
};

export type EmailStatus = {
  __typename?: 'EmailStatus';
  message: Scalars['String'];
  result: Scalars['Boolean'];
  title?: Maybe<Scalars['String']>;
};

export type FeatureToggle = {
  __typename?: 'FeatureToggle';
  name: Scalars['String'];
  value: Scalars['Boolean'];
};

export type FeatureToggles = {
  __typename?: 'FeatureToggles';
  enableOverallMaintenance?: Maybe<Scalars['Boolean']>;
};

export type Fees = {
  __typename?: 'Fees';
  paraspace_fees?: Maybe<Scalars['JSON']>;
  seller_fees?: Maybe<Scalars['JSON']>;
};

export type FilterIntCondition = {
  eq?: InputMaybe<Scalars['Int']>;
  not?: InputMaybe<Scalars['Int']>;
};

export type FilterStringCondition = {
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  not?: InputMaybe<Scalars['String']>;
};

export type InputAsset = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
};

export type InputCreateListing = {
  endTime: Scalars['Int'];
  listingHash?: InputMaybe<Scalars['String']>;
  offerer: Scalars['Address'];
  r: Scalars['String'];
  s: Scalars['String'];
  share: Scalars['Int'];
  stakingType: Scalars['Int'];
  startTime: Scalars['Int'];
  token: Scalars['Address'];
  tokenId: Scalars['Int'];
  v: Scalars['Float'];
};

export type InputCreateOrder = {
  creditData?: InputMaybe<InputCreditData>;
  protocolContract: Scalars['String'];
  protocolData: InputProtocolData;
  protocolVersion: Scalars['String'];
  side: Scalars['Int'];
  target?: InputMaybe<OrderTarget>;
  toPrivate?: InputMaybe<Scalars['Address']>;
};

export type InputCreditData = {
  amount: Scalars['String'];
  orderId: Scalars['String'];
  token: Scalars['Address'];
  vrs: InputCreditDataSignature;
};

export type InputCreditDataSignature = {
  r: Scalars['String'];
  s: Scalars['String'];
  v: Scalars['String'];
};

export type InputMatchListings = {
  apeCoinListing: InputCreateListing;
  apeListing: InputCreateListing;
  bakcListing?: InputMaybe<InputCreateListing>;
};

export type InputOfferOrConsiderationItem = {
  endAmount: Scalars['String'];
  identifierOrCriteria: Scalars['String'];
  itemType: Scalars['Int'];
  recipient?: InputMaybe<Scalars['String']>;
  startAmount: Scalars['String'];
  token: Scalars['Address'];
};

export type InputOrderFilter = {
  assets?: InputMaybe<Array<SuppliedAssets>>;
  contractAddress?: InputMaybe<Scalars['Address']>;
  hash?: InputMaybe<Scalars['String']>;
  highestUSDRank?: InputMaybe<Scalars['Boolean']>;
  identifierOrCriteria?: InputMaybe<Scalars['String']>;
  lowestUSDRank?: InputMaybe<Scalars['Boolean']>;
  maker?: InputMaybe<Scalars['Address']>;
  side?: InputMaybe<Scalars['Int']>;
  startTime?: InputMaybe<NumberLikeFilter>;
  status?: InputMaybe<OrderStatus>;
  taker?: InputMaybe<Scalars['Address']>;
};

export type InputOrderParameters = {
  conduitKey: Scalars['String'];
  consideration: Array<InputMaybe<InputOfferOrConsiderationItem>>;
  counter: Scalars['String'];
  endTime: Scalars['Timestamp'];
  offer: Array<InputMaybe<InputOfferOrConsiderationItem>>;
  offerer: Scalars['Address'];
  orderType: Scalars['Int'];
  salt: Scalars['String'];
  startTime: Scalars['Timestamp'];
  totalOriginalConsiderationItems: Scalars['Int'];
  zone: Scalars['String'];
  zoneHash: Scalars['String'];
};

export type InputPageInfo = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type InputProfile = {
  avatar?: InputMaybe<Scalars['String']>;
  notifications: Array<Scalars['String']>;
  telegram?: InputMaybe<Scalars['String']>;
  twitter?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type InputProtocolData = {
  parameters: InputOrderParameters;
  signature: Scalars['String'];
};

export type InputQueryP2PListingsFilter = {
  offerer?: InputMaybe<FilterStringCondition>;
  stakingType?: InputMaybe<FilterIntCondition>;
  token?: InputMaybe<FilterStringCondition>;
};

export type InputSuppliedAsset = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  newOwner: Scalars['Address'];
};

export type Leadboard = {
  __typename?: 'Leadboard';
  items: Array<Maybe<LeadboardItem>>;
  totalCount: Scalars['Int'];
};

export type LeadboardItem = {
  __typename?: 'LeadboardItem';
  BNPLVolume: Scalars['String'];
  address: Scalars['Address'];
  deposited: Scalars['String'];
  position: Scalars['String'];
  positionTier?: Maybe<Scalars['String']>;
};

export enum LeadboardSortBy {
  BnplDesc = 'BNPLDesc',
  DepositDesc = 'DepositDesc'
}

export type LendingSummary = {
  __typename?: 'LendingSummary';
  totalBorrow: Scalars['String'];
  totalSuppliedNFT: Scalars['String'];
  totalSupply: Scalars['String'];
};

export type LiquidationAccountInfo = {
  __typename?: 'LiquidationAccountInfo';
  address: Scalars['Address'];
  collateral: Scalars['String'];
  debt: Scalars['String'];
  healthFactor: Scalars['Float'];
  nftHealthFactor: Scalars['Float'];
};

export type LiquidationInfoForAsset = {
  __typename?: 'LiquidationInfoForAsset';
  accountInfo: LiquidationAccountInfo;
  asset: AssetInLiquidation;
};

export type LiquidationSummary = {
  __typename?: 'LiquidationSummary';
  inAuction: Scalars['String'];
  inLiquidation: Scalars['String'];
  totalAuction: Scalars['String'];
};

export type ListedResult = {
  __typename?: 'ListedResult';
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  isListedOnParaSpace: Scalars['Boolean'];
};

export type Listing = {
  __typename?: 'Listing';
  chainId?: Maybe<Scalars['Int']>;
  contractAddress: Scalars['Address'];
  currency: Scalars['String'];
  expirationTime: Scalars['Timestamp'];
  identifierOrCriteria: Scalars['String'];
  listingPrice: Scalars['String'];
  listingTime: Scalars['Timestamp'];
  maker: Scalars['Address'];
  orderHash: Scalars['String'];
  platform: Scalars['String'];
  protocolContract?: Maybe<Scalars['String']>;
  protocolData?: Maybe<ProtocolData>;
  protocolVersion?: Maybe<Scalars['String']>;
  toPrivate?: Maybe<Scalars['Address']>;
};

export enum Marketplace {
  Blur = 'Blur',
  OpenSea = 'OpenSea',
  ParaSpace = 'ParaSpace'
}

export type Moonbird = {
  __typename?: 'Moonbird';
  nesting?: Maybe<Nesting>;
};

export type Mutation = {
  __typename?: 'Mutation';
  cancelOrder?: Maybe<Order>;
  cancelOrders: Array<Maybe<Order>>;
  cancelP2PApeStakingListing: P2PApeStakingListing;
  confirmEmail: EmailStatus;
  createOrder: Order;
  createOrders: Array<Order>;
  createP2PApeStakingListings: Array<P2PApeStakingListing>;
  deleteListing?: Maybe<DeleteListingResult>;
  fulfillListings?: Maybe<Array<Maybe<Order>>>;
  fulfillOrder?: Maybe<Order>;
  joinApeWaitlist: ApeWaitlistData;
  matchP2PApeStakingListing: Scalars['String'];
  removeAccountAuctions?: Maybe<Scalars['Boolean']>;
  removeAssetAuction?: Maybe<Scalars['Boolean']>;
  sendActivationEmail: EmailStatus;
  setValidatorRecipient: Scalars['String'];
  unmatchP2PApeStakingListing: Scalars['String'];
  updateApeWaitlist: ApeWaitlistData;
  updateAssetAuctionStatus?: Maybe<Scalars['Boolean']>;
  updateProfile: Profile;
};


export type MutationCancelOrderArgs = {
  hash: Scalars['String'];
};


export type MutationCancelOrdersArgs = {
  orderHashes: Array<Scalars['String']>;
};


export type MutationCancelP2PApeStakingListingArgs = {
  listingHash: Scalars['String'];
};


export type MutationConfirmEmailArgs = {
  token: Scalars['String'];
};


export type MutationCreateOrderArgs = {
  inputOrder: InputCreateOrder;
};


export type MutationCreateOrdersArgs = {
  inputOrders: Array<InputCreateOrder>;
};


export type MutationCreateP2PApeStakingListingsArgs = {
  inputListings: Array<InputCreateListing>;
};


export type MutationDeleteListingArgs = {
  assets?: InputMaybe<Array<InputMaybe<InputAsset>>>;
};


export type MutationFulfillListingsArgs = {
  assets: Array<InputSuppliedAsset>;
};


export type MutationFulfillOrderArgs = {
  hash: Scalars['String'];
  identifierOrCriteria: Scalars['String'];
  newOwner: Scalars['Address'];
};


export type MutationJoinApeWaitlistArgs = {
  address: Scalars['Address'];
  count: ApeCount;
  email?: InputMaybe<Scalars['String']>;
  twitter: Scalars['String'];
};


export type MutationMatchP2PApeStakingListingArgs = {
  blockHeight: Scalars['String'];
  matchedHash: Scalars['String'];
  matchedListings: InputMatchListings;
  stakingType: Scalars['Int'];
};


export type MutationRemoveAccountAuctionsArgs = {
  txHash: Scalars['String'];
  user: Scalars['Address'];
};


export type MutationRemoveAssetAuctionArgs = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
};


export type MutationSendActivationEmailArgs = {
  email: Scalars['String'];
};


export type MutationSetValidatorRecipientArgs = {
  publicKey: Scalars['String'];
  recipient: Scalars['Address'];
  signature: Scalars['String'];
};


export type MutationUnmatchP2PApeStakingListingArgs = {
  blockHeight: Scalars['String'];
  matchedHash: Scalars['String'];
};


export type MutationUpdateApeWaitlistArgs = {
  address: Scalars['Address'];
  email?: InputMaybe<Scalars['String']>;
  twitter: Scalars['String'];
};


export type MutationUpdateAssetAuctionStatusArgs = {
  auctionStatus: Scalars['Int'];
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
};


export type MutationUpdateProfileArgs = {
  inputProfile: InputProfile;
};

export enum NearLiquidationAssetType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721'
}

export type Nesting = {
  __typename?: 'Nesting';
  currentDuration?: Maybe<Scalars['Int']>;
  currentNestLevelStartedAt?: Maybe<Scalars['String']>;
  currentNestingPeriodStartedAt?: Maybe<Scalars['String']>;
  nestLevel?: Maybe<Scalars['String']>;
  nestProgress?: Maybe<Scalars['Float']>;
  nested?: Maybe<Scalars['Boolean']>;
  nextNestLevelAt?: Maybe<Scalars['String']>;
  totalDuration?: Maybe<Scalars['Int']>;
};

export type Notification = {
  __typename?: 'Notification';
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  value: Scalars['Boolean'];
};

export type NumberLikeFilter = {
  equal?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  chainId?: Maybe<Scalars['Int']>;
  considerationItems: Array<ParametersConsideration>;
  creditData?: Maybe<CreditData>;
  expirationTime?: Maybe<Scalars['Timestamp']>;
  hash: Scalars['String'];
  listingTime: Scalars['Timestamp'];
  maker: Scalars['Address'];
  offerItems: Array<ParametersOffer>;
  offerValue?: Maybe<Scalars['String']>;
  platform: Marketplace;
  protocolContract?: Maybe<Scalars['String']>;
  protocolData: ProtocolData;
  protocolVersion?: Maybe<Scalars['String']>;
  /** @deprecated duplicate, use listingTime instead */
  startTime: Scalars['Timestamp'];
  status: OrderStatus;
  taker?: Maybe<Scalars['Address']>;
  target: OrderTarget;
  to?: Maybe<Scalars['Address']>;
  toPrivate?: Maybe<Scalars['Address']>;
};

export enum OrderSortBy {
  OfferValueAsc = 'OfferValueAsc',
  OfferValueDesc = 'OfferValueDesc',
  StartTimeDesc = 'StartTimeDesc'
}

export enum OrderStatus {
  Cancelled = 'Cancelled',
  Finalized = 'Finalized',
  Invalid = 'Invalid',
  Ready = 'Ready'
}

export enum OrderTarget {
  Collection = 'Collection',
  Token = 'Token'
}

export type Orders = {
  __typename?: 'Orders';
  nodes?: Maybe<Array<ShopBidByPlatform>>;
  totalCount: Scalars['Int'];
};

export type P2PApeStakingListing = {
  __typename?: 'P2PApeStakingListing';
  endTime: Scalars['Int'];
  listingHash: Scalars['String'];
  offerer: Scalars['Address'];
  r: Scalars['String'];
  s: Scalars['String'];
  share: Scalars['Int'];
  stakingType: Scalars['Int'];
  startTime: Scalars['Int'];
  token: Scalars['Address'];
  tokenId: Scalars['Int'];
  v: Scalars['Int'];
};

export type P2PApeStakingMatchPair = {
  __typename?: 'P2PApeStakingMatchPair';
  apeCoinListing: P2PApeStakingListing;
  apeListing: P2PApeStakingListing;
  bakcListing?: Maybe<P2PApeStakingListing>;
  matchedHash: Scalars['String'];
};

export type P2PApeStakingMatches = {
  __typename?: 'P2PApeStakingMatches';
  nodes: Array<P2PApeStakingMatchPair>;
  totalCount: Scalars['Int'];
};

export type P2PApeStakingMatchesSummary = {
  __typename?: 'P2PApeStakingMatchesSummary';
  totalActiveMatches: Scalars['Int'];
  totalBAKCStaked: Scalars['Int'];
  totalBAYCStaked: Scalars['Int'];
  totalMAYCStaked: Scalars['Int'];
};

export type P2PApeStakingPosition = {
  __typename?: 'P2PApeStakingPosition';
  apeCoinListing?: Maybe<P2PApeStakingListing>;
  apeListing?: Maybe<P2PApeStakingListing>;
  bakcListing?: Maybe<P2PApeStakingListing>;
  blockHeight?: Maybe<Scalars['String']>;
  matched: Scalars['Boolean'];
  matchedHash?: Maybe<Scalars['String']>;
};

export type PageInfo = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type ParaAccount = {
  __typename?: 'ParaAccount';
  EOAAccount: Scalars['Address'];
  createdBlockHeight: Scalars['String'];
  createdHash: Scalars['String'];
  paraAccount: Scalars['Address'];
};

export type ParaAccountFilter = {
  EOAAccount?: InputMaybe<Scalars['Address']>;
  paraAccount?: InputMaybe<Scalars['Address']>;
};

export type ParaAccountsBalance = {
  __typename?: 'ParaAccountsBalance';
  totalInETH: Scalars['String'];
  totalInUSD: Scalars['String'];
};

export type ParaSpaceListing = {
  __typename?: 'ParaSpaceListing';
  amount: Scalars['String'];
  chainId?: Maybe<Scalars['Int']>;
  contractAddress: Scalars['Address'];
  currency: Scalars['String'];
  currencyAddress: Scalars['Address'];
  expirationTime: Scalars['Timestamp'];
  identifierOrCriteria: Scalars['String'];
  maker: Scalars['Address'];
  protocolContract?: Maybe<Scalars['String']>;
  protocolData: ProtocolData;
  protocolVersion?: Maybe<Scalars['String']>;
  startTime: Scalars['Timestamp'];
};

export type ParaXUserPoint = {
  __typename?: 'ParaXUserPoint';
  additional: Scalars['String'];
  deposit: Scalars['String'];
  interaction: Scalars['String'];
  name: Scalars['Address'];
  position: Scalars['String'];
  positionTier?: Maybe<Scalars['String']>;
  total: Scalars['String'];
  v1: Scalars['String'];
};

export type ParaXUserPoints = {
  __typename?: 'ParaXUserPoints';
  items: Array<Maybe<ParaXUserPoint>>;
  totalCount: Scalars['Int'];
};

export type Parameters = {
  __typename?: 'Parameters';
  conduitKey?: Maybe<Scalars['String']>;
  consideration?: Maybe<Array<Maybe<ParametersConsideration>>>;
  counter?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['Timestamp']>;
  offer?: Maybe<Array<Maybe<ParametersOffer>>>;
  offerer?: Maybe<Scalars['String']>;
  orderType?: Maybe<Scalars['Int']>;
  salt?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['Timestamp']>;
  totalOriginalConsiderationItems?: Maybe<Scalars['Int']>;
  zone?: Maybe<Scalars['String']>;
  zoneHash?: Maybe<Scalars['String']>;
};

export type ParametersConsideration = {
  __typename?: 'ParametersConsideration';
  endAmount?: Maybe<Scalars['String']>;
  identifierOrCriteria?: Maybe<Scalars['String']>;
  itemType?: Maybe<Scalars['Int']>;
  recipient?: Maybe<Scalars['String']>;
  startAmount?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type ParametersOffer = {
  __typename?: 'ParametersOffer';
  endAmount?: Maybe<Scalars['String']>;
  identifierOrCriteria?: Maybe<Scalars['String']>;
  itemType?: Maybe<Scalars['Int']>;
  recipient?: Maybe<Scalars['String']>;
  startAmount?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['String']>;
};

export type PaymentToken = {
  __typename?: 'PaymentToken';
  address: Scalars['Address'];
  symbol: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  avatar?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  notifications: Array<Notification>;
  telegram?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  walletAddress: Scalars['Address'];
};

export type ProtocolData = {
  __typename?: 'ProtocolData';
  parameters?: Maybe<Parameters>;
  signature?: Maybe<Scalars['String']>;
};

export type ReservoirBid = {
  __typename?: 'ReservoirBid';
  contractAddress: Scalars['Address'];
  currency: Scalars['String'];
  expirationTime?: Maybe<Scalars['Timestamp']>;
  feeBps?: Maybe<Scalars['Int']>;
  hash: Scalars['String'];
  identifierOrCriteria: Scalars['String'];
  listingTime: Scalars['Timestamp'];
  maker: Scalars['Address'];
  offerValue?: Maybe<Scalars['String']>;
  platform: Marketplace;
};

export type ReservoirListing = {
  __typename?: 'ReservoirListing';
  contractAddress: Scalars['Address'];
  currency: Scalars['String'];
  expirationTime: Scalars['Timestamp'];
  identifierOrCriteria: Scalars['String'];
  listingPrice: Scalars['String'];
  listingTime: Scalars['Timestamp'];
  orderHash: Scalars['String'];
  platform: Scalars['String'];
};

export type RootQuery = {
  __typename?: 'RootQuery';
  P2PApeStakingListings: Array<P2PApeStakingListing>;
  P2PApeStakingMatches: P2PApeStakingMatches;
  P2PApeStakingMatchesSummary: P2PApeStakingMatchesSummary;
  P2PApeStakingPositions: Array<P2PApeStakingPosition>;
  aggregatedOrders?: Maybe<AggregatedOrders>;
  apeWaitlistData: ApeWaitlistData;
  /** @deprecated change to use shopItemDetail instead */
  asset?: Maybe<Asset>;
  autoCompoundHistory: Array<AutoCompoundHistory>;
  checkAddressInWhitelist: Scalars['Boolean'];
  checkNftListedOnParaSpace: Array<Maybe<ListedResult>>;
  collections?: Maybe<Array<Maybe<Collection>>>;
  featureToggles: Array<FeatureToggle>;
  inLiquidationAccounts: Array<AccountInLiquidationInfo>;
  leadboard: Leadboard;
  liquidationInfoForAsset?: Maybe<LiquidationInfoForAsset>;
  moonbird?: Maybe<Moonbird>;
  nearLiquidationAccounts: Array<AccountNearLiquidationInfo>;
  orders?: Maybe<Orders>;
  paraAccounts: Array<ParaAccount>;
  paraAccountsBalance: ParaAccountsBalance;
  paraXUserPoints: ParaXUserPoints;
  pausedLiquidationAccounts: Array<AccountInLiquidationInfo>;
  personalLeadboard?: Maybe<LeadboardItem>;
  personalParaXUserPoint?: Maybe<ParaXUserPoint>;
  personalUserPoint?: Maybe<UserPoint>;
  profile?: Maybe<Profile>;
  shopItemDetail?: Maybe<ShopItemDetail>;
  shopItems: ShopItems;
  shopItemsOfParaSpace: ShopItems;
  shopListingWithProtocol: Array<Listing>;
  shopListings: Array<Listing>;
  summary: SummaryData;
  timelockQueues: Array<Timelock>;
  timelockQueuesForAssets: Array<TimelockForAsset>;
  tokensBasicInfo: Array<TokensBasicInfo>;
  uniswapV3BasicInfos: Array<UniswapV3BasicInfo>;
  userAssets?: Maybe<UserAssets>;
  userInLiquidation?: Maybe<AccountInLiquidationInfo>;
  userPoints: UserPoints;
  validatorExitInfos: Array<ValidatorExitInfo>;
};


export type RootQueryP2PApeStakingListingsArgs = {
  filter?: InputMaybe<InputQueryP2PListingsFilter>;
  listingType: Scalars['Int'];
  pageInfo?: InputMaybe<InputPageInfo>;
};


export type RootQueryP2PApeStakingMatchesArgs = {
  pageInfo?: InputMaybe<InputPageInfo>;
};


export type RootQueryP2PApeStakingPositionsArgs = {
  walletAddress: Scalars['Address'];
};


export type RootQueryAggregatedOrdersArgs = {
  filter?: InputMaybe<InputOrderFilter>;
  pageInfo?: InputMaybe<InputPageInfo>;
  platforms: Array<Marketplace>;
  sortBy?: InputMaybe<OrderSortBy>;
};


export type RootQueryApeWaitlistDataArgs = {
  address: Scalars['Address'];
};


export type RootQueryAssetArgs = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
};


export type RootQueryAutoCompoundHistoryArgs = {
  filter?: InputMaybe<AutoCompoundHistoryFilter>;
};


export type RootQueryCheckAddressInWhitelistArgs = {
  walletAddress: Scalars['Address'];
};


export type RootQueryCheckNftListedOnParaSpaceArgs = {
  assets?: InputMaybe<Array<InputAsset>>;
};


export type RootQueryLeadboardArgs = {
  pageInfo?: InputMaybe<PageInfo>;
  sortBy?: InputMaybe<LeadboardSortBy>;
};


export type RootQueryLiquidationInfoForAssetArgs = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
};


export type RootQueryMoonbirdArgs = {
  tokenId?: InputMaybe<Scalars['String']>;
};


export type RootQueryOrdersArgs = {
  filter?: InputMaybe<InputOrderFilter>;
  pageInfo?: InputMaybe<InputPageInfo>;
  platforms: Array<Marketplace>;
  sortBy?: InputMaybe<OrderSortBy>;
};


export type RootQueryParaAccountsArgs = {
  filter?: InputMaybe<ParaAccountFilter>;
};


export type RootQueryParaXUserPointsArgs = {
  pageInfo?: InputMaybe<PageInfo>;
};


export type RootQueryPersonalLeadboardArgs = {
  sortBy?: InputMaybe<LeadboardSortBy>;
  walletAddress: Scalars['Address'];
};


export type RootQueryPersonalParaXUserPointArgs = {
  walletAddress: Scalars['Address'];
};


export type RootQueryPersonalUserPointArgs = {
  walletAddress: Scalars['Address'];
};


export type RootQueryShopItemDetailArgs = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
};


export type RootQueryShopItemsArgs = {
  contractAddress: Scalars['Address'];
  filter?: InputMaybe<ShopItemsInputFilter>;
  marketplace: Marketplace;
  pageInfo?: InputMaybe<ContinuationPageInfo>;
};


export type RootQueryShopItemsOfParaSpaceArgs = {
  contractAddress: Scalars['Address'];
  filter?: InputMaybe<ShopItemsInputFilter>;
  pageInfo?: InputMaybe<InputPageInfo>;
};


export type RootQueryShopListingWithProtocolArgs = {
  listings: Array<TokenListing>;
  platform: Marketplace;
};


export type RootQueryShopListingsArgs = {
  filter?: InputMaybe<ShopListingsInputFilter>;
};


export type RootQueryTimelockQueuesArgs = {
  filter?: InputMaybe<TimelockQueueFilter>;
};


export type RootQueryTimelockQueuesForAssetsArgs = {
  assets: AssetsFilter;
};


export type RootQueryUserAssetsArgs = {
  walletAddress: Scalars['Address'];
};


export type RootQueryUserInLiquidationArgs = {
  account: Scalars['Address'];
};


export type RootQueryUserPointsArgs = {
  pageInfo?: InputMaybe<PageInfo>;
};


export type RootQueryValidatorExitInfosArgs = {
  walletAddress: Scalars['Address'];
};

export type ShopBidByPlatform = Order | ReservoirBid;

export type ShopItem = {
  __typename?: 'ShopItem';
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  isSupplied: Scalars['Boolean'];
  lowestPriceListing?: Maybe<ShopListingByPlatform>;
  multiplier?: Maybe<Scalars['Float']>;
  ownedBy?: Maybe<Scalars['Address']>;
  topOffer?: Maybe<ShopBidByPlatform>;
};

export type ShopItemDetail = {
  __typename?: 'ShopItemDetail';
  collection?: Maybe<Collection>;
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  isSupplied: Scalars['Boolean'];
  listings: Array<Maybe<ShopListingByPlatform>>;
  multiplier?: Maybe<Scalars['Float']>;
  ownedBy?: Maybe<Scalars['Address']>;
  topOffer?: Maybe<ShopBidByPlatform>;
  traits?: Maybe<Array<Maybe<Traits>>>;
};

export enum ShopItemSort {
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc'
}

export type ShopItems = {
  __typename?: 'ShopItems';
  continuation?: Maybe<Scalars['String']>;
  items: Array<Maybe<ShopItem>>;
};

export type ShopItemsInputFilter = {
  identifierOrCriteria?: InputMaybe<Scalars['String']>;
  maxPrice?: InputMaybe<Scalars['Float']>;
  minPrice?: InputMaybe<Scalars['Float']>;
  sort?: InputMaybe<ShopItemSort>;
};

export type ShopListingByPlatform = Listing | ReservoirListing;

export enum ShopListingSort {
  Newest = 'Newest',
  Oldest = 'Oldest',
  PriceAsc = 'PriceAsc',
  PriceDesc = 'PriceDesc'
}

export type ShopListingsInputFilter = {
  assets?: InputMaybe<Array<InputAsset>>;
  lowestListing?: InputMaybe<Scalars['Boolean']>;
  makers?: InputMaybe<Array<Scalars['Address']>>;
  orderHashes?: InputMaybe<Array<Scalars['String']>>;
  sort?: InputMaybe<ShopListingSort>;
};

export type ShopSummary = {
  __typename?: 'ShopSummary';
  availableNFT: Scalars['String'];
  purchased: Scalars['String'];
  volume: Scalars['String'];
};

export type SummaryData = {
  __typename?: 'SummaryData';
  apeStaking?: Maybe<ApeStakingSummary>;
  lending?: Maybe<LendingSummary>;
  liquidation?: Maybe<LiquidationSummary>;
  shop?: Maybe<ShopSummary>;
};

export type SuppliedAssets = {
  contractAddress: Scalars['Address'];
  identifiers: Array<Scalars['String']>;
};

export type TimeLockStrategyData = {
  __typename?: 'TimeLockStrategyData';
  lastResetTimestamp: Scalars['Int'];
  maxWaitTime: Scalars['Int'];
  midThreshold: Scalars['String'];
  midWaitTime: Scalars['Int'];
  minThreshold: Scalars['String'];
  minWaitTime: Scalars['Int'];
  period: Scalars['Int'];
  poolPeriodLimit: Scalars['String'];
  poolPeriodWaitTime: Scalars['Int'];
  totalAmountInCurrentPeriod: Scalars['String'];
};

export type Timelock = {
  __typename?: 'Timelock';
  actionType: Scalars['Int'];
  agreementId: Scalars['Int'];
  assetInfo: TimelockAssetInfo;
  blockHeight: Scalars['Int'];
  expectedRelease: Scalars['Timestamp'];
  status: Scalars['Int'];
  timeAdded: Scalars['Timestamp'];
  transaction: Scalars['String'];
};

export type TimelockAssetInfo = {
  __typename?: 'TimelockAssetInfo';
  amount?: Maybe<Scalars['String']>;
  token: Scalars['Address'];
  tokenIds?: Maybe<Array<Scalars['Int']>>;
  type: Scalars['Int'];
};

export type TimelockForAsset = {
  __typename?: 'TimelockForAsset';
  contractAddress: Scalars['Address'];
  expectedRelease: Scalars['Timestamp'];
  isClaimed: Scalars['Boolean'];
  tokenId: Scalars['String'];
};

export type TimelockQueueFilter = {
  address?: InputMaybe<Scalars['Address']>;
};

export type TokenListing = {
  contractAddress: Scalars['Address'];
  identifierOrCriteria: Scalars['String'];
  orderHash: Scalars['String'];
};

export type TokensBasicInfo = {
  __typename?: 'TokensBasicInfo';
  address: Scalars['Address'];
  availableLiquidity: Scalars['String'];
  baseLTVasCollateral: Scalars['String'];
  borrowApyRate: Scalars['String'];
  borrowRewardRate: Scalars['String'];
  borrowUp: Scalars['String'];
  borrowingEnabled: Scalars['Boolean'];
  decimals: Scalars['Int'];
  priceInETH: Scalars['String'];
  priceInUsd: Scalars['String'];
  reserveLiquidationThreshold: Scalars['String'];
  supplyApyRate: Scalars['String'];
  supplyRewardRate: Scalars['String'];
  symbol: Scalars['String'];
  timeLockStrategyData: TimeLockStrategyData;
  totalDebt: Scalars['String'];
  totalDebtUSD: Scalars['String'];
  totalLiquidityUSD: Scalars['String'];
  totalSupplied: Scalars['String'];
  totalUsd: Scalars['String'];
  variableDebtTokenAddress: Scalars['Address'];
  xTokenAddress: Scalars['Address'];
};

export type Traits = {
  __typename?: 'Traits';
  traitCount?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type UniswapV3BasicInfo = {
  __typename?: 'UniswapV3BasicInfo';
  ltv: Scalars['String'];
  name: Scalars['String'];
  token0Address?: Maybe<Scalars['Address']>;
  token0Symbol: Scalars['String'];
  token1Address?: Maybe<Scalars['Address']>;
  token1Symbol: Scalars['String'];
  totalSupplied: Scalars['String'];
  totalUsd: Scalars['String'];
};

export type UserAssets = {
  __typename?: 'UserAssets';
  p2pUnclaimedRewards: Scalars['Boolean'];
  pairedP2PTokens: Scalars['Boolean'];
  timelockQueues: Scalars['Boolean'];
  userPositions?: Maybe<UserPositions>;
};

export type UserPoint = {
  __typename?: 'UserPoint';
  apeStaking: Scalars['String'];
  borrow: Scalars['String'];
  name: Scalars['Address'];
  position: Scalars['String'];
  positionTier?: Maybe<Scalars['String']>;
  supply: Scalars['String'];
  total: Scalars['String'];
};

export type UserPoints = {
  __typename?: 'UserPoints';
  items: Array<Maybe<UserPoint>>;
  totalCount: Scalars['Int'];
};

export type UserPositions = {
  __typename?: 'UserPositions';
  borrowed: Scalars['String'];
  supplied: Scalars['String'];
};

export type ValidatorExitInfo = {
  __typename?: 'ValidatorExitInfo';
  nftMintStatus: Scalars['String'];
  publicKey: Scalars['String'];
  recipient: Scalars['Address'];
  validatorIndex: Scalars['String'];
};

export type DeleteListingResult = {
  __typename?: 'deleteListingResult';
  message: Scalars['String'];
};

export type TotalListedNfTsCount = {
  __typename?: 'totalListedNFTsCount';
  count?: Maybe<Scalars['Int']>;
};

export type ParaAccountsQueryVariables = Exact<{
  filter?: InputMaybe<ParaAccountFilter>;
}>;


export type ParaAccountsQuery = { __typename?: 'RootQuery', paraAccounts: Array<{ __typename?: 'ParaAccount', paraAccount: any, EOAAccount: any, createdHash: string, createdBlockHeight: string }> };


export const ParaAccountsDocument = gql`
    query ParaAccounts($filter: ParaAccountFilter) {
  paraAccounts(filter: $filter) {
    paraAccount
    EOAAccount
    createdHash
    createdBlockHeight
  }
}
    `;

/**
 * __useParaAccountsQuery__
 *
 * To run a query within a React component, call `useParaAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useParaAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useParaAccountsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useParaAccountsQuery(baseOptions?: Apollo.QueryHookOptions<ParaAccountsQuery, ParaAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ParaAccountsQuery, ParaAccountsQueryVariables>(ParaAccountsDocument, options);
      }
export function useParaAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ParaAccountsQuery, ParaAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ParaAccountsQuery, ParaAccountsQueryVariables>(ParaAccountsDocument, options);
        }
export type ParaAccountsQueryHookResult = ReturnType<typeof useParaAccountsQuery>;
export type ParaAccountsLazyQueryHookResult = ReturnType<typeof useParaAccountsLazyQuery>;
export type ParaAccountsQueryResult = Apollo.QueryResult<ParaAccountsQuery, ParaAccountsQueryVariables>;